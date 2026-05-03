/**
 * Jua Café - Main Application Logic (Controller)
 */

import { menuItems, uiTranslations } from './js/data.js';
import { translator } from './js/translations.js';
import { createItemCard, createCategoryTab, createCartPage, createItemDetailsPage, createAboutPage } from './js/components.js';
import { supabase } from './js/supabase.js';

// Load cart from localStorage
const savedCart = localStorage.getItem('cart');
const initialCart = savedCart ? JSON.parse(savedCart) : [];

// Load favorites from localStorage with error handling
let initialFavs = [];
try {
    const savedFavs = localStorage.getItem('favorites');
    if (savedFavs) {
        initialFavs = JSON.parse(savedFavs);
        // Ensure it's an array
        if (!Array.isArray(initialFavs)) initialFavs = [];
    }
} catch (e) {
    console.error("Error loading favorites:", e);
    initialFavs = [];
}

// Application State
const state = {
    activeCategory: "All",
    menuData: [], // To be filled from Supabase
    categories: [], // To be filled from Supabase
    cart: initialCart,
    favorites: initialFavs,
    currentView: window.location.hash === '#about' ? 'about' : 'menu' // 'menu', 'cart', 'details', 'about'
};

/**
 * Fetch Data from Supabase
 */
async function fetchSupabaseData() {
    // Fetch categories
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name_en');
    
    if (catError) {
        console.error('Error fetching categories:', catError);
        // Fallback to static if needed or show error
    } else {
        state.categories = [
            { id: "All", so: "Dhammaan", en: "All" },
            ...categories.map(c => ({ id: c.id, so: c.name_so, en: c.name_en }))
        ];
    }

    // Fetch menu items
    const { data: items, error: itemError } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (itemError) {
        console.error('Error fetching items:', itemError);
        state.menuData = menuItems; // Fallback to static
    } else {
        state.menuData = items.map(item => ({
            id: item.id,
            name: { en: item.name_en, so: item.name_so },
            category: item.category_id,
            price: item.price,
            image: item.image_url,
            description: { en: item.description_en, so: item.description_so },
            isPopular: item.is_popular,
            rating: item.rating,
            prepTime: item.prep_time
        }));
    }

    renderCurrentView();
}

/**
 * Unified language switching logic
 */
window.switchLanguage = (lang) => {
    if (translator.getLanguage() === lang) return;

    translator.setLanguage(lang);
    translator.updateStaticText();
    translator.updateLanguageButtons();

    renderCurrentView();
};

/**
 * Initialize the App
 */
async function init() {
    updateCartBadge();
    
    // Initial render with loading state or static fallback
    renderCurrentView();
    
    // Fetch fresh data from Supabase
    await fetchSupabaseData();

    translator.updateStaticText();
    translator.updateLanguageButtons();


    // Language Switchers
    const soBtn = document.getElementById('lang-so');
    const enBtn = document.getElementById('lang-en');

    if (soBtn) soBtn.onclick = () => window.switchLanguage('so');
    if (enBtn) enBtn.onclick = () => window.switchLanguage('en');

    // Cart Button in Header
    const cartBtn = document.querySelector('button .cart-badge').parentElement;
    if (cartBtn) {
        cartBtn.onclick = () => showView('cart');
    }

    // About Button in Footer
    const footerAboutBtn = document.getElementById('footer-about');
    if (footerAboutBtn) {
        footerAboutBtn.onclick = () => showView('about');
    }

    // Home Button in Footer
    const footerHomeBtn = document.getElementById('footer-home');
    if (footerHomeBtn) {
        footerHomeBtn.onclick = () => showView('menu');
    }
}

/**
 * Render Categories
 */
function renderCategories() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) return;

    categoryList.innerHTML = '';
    const currentLang = translator.getLanguage();

    state.categories.forEach(cat => {
        const isActive = cat.id === state.activeCategory;
        const btn = createCategoryTab(
            cat,
            currentLang,
            isActive,
            () => filterCategory(cat.id)
        );
        categoryList.appendChild(btn);
    });
}


/**
 * Filter by Category
 */
function filterCategory(category) {
    state.activeCategory = category;
    renderCategories();
    applyFilters();

    if (window.scrollY > 200) {
        const nav = document.getElementById('category-nav');
        if (nav) nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Filter Logic
 */
function applyFilters() {
    const { activeCategory, menuData } = state;

    const filteredItems = menuData.filter(item => {
        return activeCategory === "All" || item.category === activeCategory;
    });

    renderMenu(filteredItems);
}

/**
 * Render Menu Grid
 */
function renderMenu(items) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const currentLang = translator.getLanguage();
    const translations = uiTranslations[currentLang];

    if (items.length === 0) {
        grid.innerHTML = `<p class="col-span-2 text-center text-gray-400 py-10 fade-in">${translations.noItems}</p>`;
        return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
        // Robust ID comparison (string vs number)
        const isFavorite = state.favorites.some(f => String(f.id) === String(item.id));
        const card = createItemCard(
            { ...item, isFavorite },
            currentLang,
            index,
            translations,
            (item, e) => addToCart(item, e),
            (item) => showView('details', item),
            (item) => toggleFavorite(item)
        );
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);

    // Image loading polish
    setTimeout(() => {
        grid.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                img.parentElement.classList.add('loaded');
            } else {
                img.onload = () => img.parentElement.classList.add('loaded');
                img.onerror = () => {
                    img.parentElement.classList.add('loaded', 'error');
                    img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=60&w=300';
                };
            }
        });
    }, 50);
}

/**
 * Cart Management
 */
function addToCart(item, event) {
    // If no event, just add (e.g. from programmatic call)
    if (!event) {
        processAddToCart(item);
        return;
    }

    // Try to find the image to animate
    let itemImage;
    if (event.target.closest('.item-card')) {
        itemImage = event.target.closest('.item-card').querySelector('img');
    } else if (state.currentView === 'details') {
        itemImage = document.querySelector('img.object-cover');
    }

    if (itemImage) {
        animateFlyToCart(itemImage, () => processAddToCart(item));
    } else {
        processAddToCart(item);
    }
}

function processAddToCart(item) {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    updateCartBadge();
}

/**
 * Premium "Fly to Cart" Animation
 */
function animateFlyToCart(sourceImg, callback) {
    const cartBtn = document.getElementById('cart-btn-main');
    if (!cartBtn) {
        callback();
        return;
    }

    const imgRect = sourceImg.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    // Create a clone of the image
    const clone = sourceImg.cloneNode();
    clone.classList.add('flying-item');

    // Set initial position
    clone.style.top = `${imgRect.top}px`;
    clone.style.left = `${imgRect.left}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;

    document.body.appendChild(clone);

    // Force reflow
    clone.offsetWidth;

    // Animate to cart
    clone.style.top = `${cartRect.top + 5}px`;
    clone.style.left = `${cartRect.left + 5}px`;
    clone.style.width = '20px';
    clone.style.height = '20px';
    clone.style.opacity = '0.4';
    clone.style.transform = 'scale(0.1)';

    // Cleanup and trigger callback
    clone.addEventListener('transitionend', () => {
        clone.remove();

        // Add a small shake animation to the cart button
        cartBtn.classList.add('cart-shake');
        setTimeout(() => cartBtn.classList.remove('cart-shake'), 400);

        callback();
    }, { once: true });
}

function updateCartQty(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            state.cart = state.cart.filter(i => i.id !== id);
        }
    }
    saveCart();
    updateCartBadge();
    if (state.currentView === 'cart') showView('cart');
}

function removeFromCart(id) {
    state.cart = state.cart.filter(i => i.id !== id);
    saveCart();
    updateCartBadge();
    if (state.currentView === 'cart') showView('cart');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Favorite Management
 */
function toggleFavorite(item) {
    // Robust search for item by ID
    const index = state.favorites.findIndex(f => String(f.id) === String(item.id));

    if (index > -1) {
        state.favorites.splice(index, 1);
    } else {
        // Only store essential data to save space
        const { id, name, price, image, category, rating, prepTime, description } = item;
        state.favorites.push({ id, name, price, image, category, rating, prepTime, description });
    }

    try {
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
    } catch (e) {
        console.error("Error saving favorites:", e);
    }

    // Refresh current view if it's favorites
    if (state.currentView === 'favorites') {
        showView('favorites');
    }
}

/**
 * View Management (Routing)
 */
function showView(view, data = null) {
    state.currentView = view;
    renderCurrentView(data);
}

function renderCurrentView(data = null) {
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const heroSection = document.getElementById('hero-section');
    const searchSection = document.getElementById('search-section');
    const categoryNav = document.getElementById('category-nav');
    const menuSection = document.querySelector('section.px-6.mt-2');
    const bottomNav = document.querySelector('nav.fixed');

    // Reset visibility
    // Set visibility based on view
    const isMenu = state.currentView === 'menu';
    const isAbout = state.currentView === 'about';
    const isCart = state.currentView === 'cart';
    const isDetails = state.currentView === 'details';

    if (header) header.style.display = (isMenu) ? 'flex' : 'none';
    if (main) main.style.display = (isMenu) ? 'block' : 'none';
    if (heroSection) heroSection.style.display = isMenu ? 'block' : 'none';
    if (categoryNav) categoryNav.style.display = isMenu ? 'block' : 'none';
    if (menuSection) menuSection.style.display = isMenu ? 'block' : 'none';
    if (bottomNav) bottomNav.style.display = isCart ? 'none' : 'flex';

    // Remove existing extra views
    const extraView = document.getElementById('extra-view');
    if (extraView) extraView.remove();

    const currentLang = translator.getLanguage();
    const translations = uiTranslations[currentLang];

    // Update bottom nav active state
    const footerIcons = [
        document.getElementById('footer-home'),
        document.getElementById('footer-about'),
        document.getElementById('footer-review')
    ].filter(el => el !== null);

    footerIcons.forEach(icon => {
        icon.classList.remove('text-primary');
        icon.classList.add('text-gray-400');
    });

    switch (state.currentView) {
        case 'menu':
            if (footerIcons[0]) {
                footerIcons[0].classList.add('text-primary');
                footerIcons[0].classList.remove('text-gray-400');
            }
            renderCategories();
            applyFilters();
            window.scrollTo(0, 0);
            break;

        case 'cart':
            // Visibility already handled above


            const cartPage = document.createElement('div');
            cartPage.id = 'extra-view';
            cartPage.appendChild(createCartPage(
                state.cart,
                currentLang,
                translations,
                updateCartQty,
                removeFromCart,
                () => showView('menu'),
                () => {
                    if (confirm(translations.confirmCheckout)) {
                        state.cart = [];
                        saveCart();
                        updateCartBadge();
                        showView('menu');
                        alert("Thank you for your order!");
                    }
                }
            ));
            main.parentElement.appendChild(cartPage);
            break;

        case 'details':
            // Visibility already handled above
            const detailsPage = createItemDetailsPage(
                data,
                currentLang,
                translations,
                addToCart,
                () => showView('menu')
            );
            detailsPage.id = 'extra-view';
            main.parentElement.appendChild(detailsPage);
            break;

        case 'about':
            if (footerIcons[1]) {
                footerIcons[1].classList.add('text-primary');
                footerIcons[1].classList.remove('text-gray-400');
            }
            // Visibility already handled above

            const aboutPage = document.createElement('div');
            aboutPage.id = 'extra-view';
            aboutPage.appendChild(createAboutPage(
                currentLang,
                translations,
                () => showView('menu')
            ));
            main.parentElement.appendChild(aboutPage);
            break;
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
