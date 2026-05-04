/**
 * Jua Café - Main Application Logic (Controller)
 */

import { menuItems, uiTranslations, config, staffMembers } from './js/data.js';
import { translator } from './js/translations.js';
import { createItemCard, createCategoryTab, createCartPage, createItemDetailsPage, createAboutPage, createReviewPage } from './js/components.js';
import { supabase } from './js/supabase.js';
import { initReviewLogic } from './js/reviews.js';


/**
 * Format cart items into a WhatsApp-friendly message
 */
function formatWhatsAppMessage(cart, lang, translations) {
    const greeting = lang === 'so' 
        ? `Asc, ${config.name}! Waxaan rabaa inaan dalbado:` 
        : `Hi ${config.name}! I would like to order:`;
    
    const totalLabel = translations.total || "Total";
    const currency = translations.currency || "ETB";

    let itemsList = cart.map(item => {
        return `• ${item.quantity}x ${item.name[lang]} - ${currency} ${(item.price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const footer = lang === 'so'
        ? "\n\nFadlan ii xaqiiji dalabkan. Mahadsanid!"
        : "\n\nPlease confirm my order. Thank you!";
    
    return `${greeting}\n\n${itemsList}\n\n*${totalLabel}: ${currency} ${grandTotal.toFixed(2)}*${footer}`;
}


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
    searchQuery: "",
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

    // Review Button in Footer
    const footerReviewBtn = document.getElementById('footer-review');
    if (footerReviewBtn) {
        footerReviewBtn.onclick = () => showView('review');
    }

    // Search Toggle
    const searchBtn = document.getElementById('search-btn-header');
    const closeSearchBtn = document.getElementById('close-search');
    const searchInput = document.getElementById('main-search-input');

    if (searchBtn) {
        searchBtn.onclick = () => toggleSearch(true);
    }
    if (closeSearchBtn) {
        closeSearchBtn.onclick = () => toggleSearch(false);
    }
    if (searchInput) {
        searchInput.oninput = (e) => {
            state.searchQuery = e.target.value;
            applyFilters();
        };
    }

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.onsubmit = (e) => {
            e.preventDefault();
            if (searchInput) searchInput.blur();
        };
    }
}

/**
 * Toggle Search UI
 */
function toggleSearch(active) {
    const hero = document.getElementById('hero-section');
    const search = document.getElementById('search-section');
    const input = document.getElementById('main-search-input');
    
    if (!hero || !search) return;

    if (active) {
        hero.style.display = 'none';
        search.style.display = 'block';
        if (input) input.focus();
    } else {
        hero.style.display = 'block';
        search.style.display = 'none';
        state.searchQuery = "";
        if (input) input.value = "";
        applyFilters();
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
    const { activeCategory, menuData, searchQuery } = state;
    const currentLang = translator.getLanguage();

    const filteredItems = menuData.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const query = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            item.name.en.toLowerCase().includes(query) || 
            item.name.so.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
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
                    img.src = config.fallbackImage;
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
    const item = state.cart.find(i => String(i.id) === String(id));
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            state.cart = state.cart.filter(i => String(i.id) !== String(id));
        }
    }
    saveCart();
    updateCartBadge();
    if (state.currentView === 'cart') showView('cart');
}

function removeFromCart(id) {
    state.cart = state.cart.filter(i => String(i.id) !== String(id));
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
    window.scrollTo(0, 0);
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
    if (categoryNav) categoryNav.style.display = isMenu ? 'block' : 'none';
    if (menuSection) menuSection.style.display = isMenu ? 'block' : 'none';
    if (bottomNav) bottomNav.style.display = isCart ? 'none' : 'flex';

    // Search vs Hero mutually exclusive logic
    if (isMenu) {
        const isSearching = !!state.searchQuery;
        if (heroSection) heroSection.style.display = isSearching ? 'none' : 'block';
        if (searchSection) searchSection.style.display = isSearching ? 'block' : 'none';
    } else {
        if (heroSection) heroSection.style.display = 'none';
        if (searchSection) searchSection.style.display = 'none';
    }

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
                        // Generate WhatsApp message
                        const message = formatWhatsAppMessage(state.cart, currentLang, translations);
                        const encodedMessage = encodeURIComponent(message);
                        const whatsappUrl = `https://wa.me/${config.phone}?text=${encodedMessage}`;
                        
                        // Open WhatsApp
                        window.open(whatsappUrl, '_blank');

                        // Clear cart locally
                        state.cart = [];
                        saveCart();
                        updateCartBadge();
                        showView('menu');
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
                staffMembers,
                () => showView('menu')
            ));
            main.parentElement.appendChild(aboutPage);
            break;

        case 'review':
            if (footerIcons[2]) {
                footerIcons[2].classList.add('text-primary');
                footerIcons[2].classList.remove('text-gray-400');
            }
            
            const reviewPage = createReviewPage(
                currentLang,
                translations,
                () => showView('menu')
            );
            reviewPage.id = 'extra-view';
            main.parentElement.appendChild(reviewPage);
            
            // Initialize the review logic after the component is in the DOM
            initReviewLogic(translations);
            break;
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
