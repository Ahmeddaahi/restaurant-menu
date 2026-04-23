/**
 * Jua Café - Main Application Logic (Controller)
 */

import { menuItems, categories, uiTranslations } from './js/data.js';
import { translator } from './js/translations.js';
import { createItemCard, createCategoryTab, createCartPage, createItemDetailsPage, createFavoritesPage } from './js/components.js';

// Load data from localStorage or fallback to default
const savedItems = localStorage.getItem('customMenuItems');
const initialMenuItems = savedItems ? JSON.parse(savedItems) : menuItems;

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
    searchTerm: "",
    menuData: initialMenuItems,
    cart: initialCart,
    favorites: initialFavs,
    currentView: 'menu' // 'menu', 'cart', 'details', 'favorites'
};

/**
 * Unified language switching logic
 */
window.switchLanguage = (lang) => {
    if (translator.getLanguage() === lang) return;
    
    translator.setLanguage(lang);
    translator.updateStaticText();
    translator.updateLanguageButtons();
    updateSearchPlaceholder();
    
    renderCurrentView();
};

/**
 * Initialize the App
 */
function init() {
    updateCartBadge();
    renderCurrentView();
    translator.updateStaticText();
    translator.updateLanguageButtons();
    updateSearchPlaceholder();

    // Search input listener
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.oninput = (e) => {
            state.searchTerm = e.target.value.toLowerCase().trim();
            applyFilters();
        };
    }
    
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

    // Favorites Button in Footer
    const footerFavBtn = document.querySelectorAll('nav.fixed.bottom-6 > div')[1];
    if (footerFavBtn) {
        footerFavBtn.onclick = () => showView('favorites');
        footerFavBtn.classList.add('hover:text-primary', 'transition-colors');
    }

    // Home Button in Footer
    const footerHomeBtn = document.querySelectorAll('nav.fixed.bottom-6 > div')[0];
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

    categories.forEach(cat => {
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
 * Update Search Placeholder
 */
function updateSearchPlaceholder() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = translator.translate('searchPlaceholder');
    }
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
    const { activeCategory, searchTerm, menuData } = state;

    const filteredItems = menuData.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        
        if (!searchTerm) return matchesCategory;

        const nameSo = item.name.so.toLowerCase();
        const nameEn = item.name.en.toLowerCase();
        const descSo = item.description.so.toLowerCase();
        const descEn = item.description.en.toLowerCase();

        const matchesSearch = nameSo.includes(searchTerm) || 
                            nameEn.includes(searchTerm) || 
                            descSo.includes(searchTerm) || 
                            descEn.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    renderMenu(filteredItems, searchTerm !== "");
}

/**
 * Render Menu Grid
 */
function renderMenu(items, isSearching = false) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const currentLang = translator.getLanguage();
    const translations = uiTranslations[currentLang];

    if (items.length === 0) {
        const emptyMessage = isSearching ? translations.searchNoResults : translations.noItems;
        grid.innerHTML = `<p class="col-span-2 text-center text-gray-400 py-10 fade-in">${emptyMessage}</p>`;
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
            (item) => addToCart(item),
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
function addToCart(item) {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ ...item, quantity: 1 });
    }
    
    saveCart();
    updateCartBadge();
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
    const searchSection = document.querySelector('section.px-6.space-y-4');
    const categoryNav = document.getElementById('category-nav');
    const menuSection = document.querySelector('section.px-6.mt-2');
    const bottomNav = document.querySelector('nav.fixed.bottom-6');

    // Reset visibility
    if (searchSection) searchSection.style.display = 'none';
    if (categoryNav) categoryNav.style.display = 'none';
    if (menuSection) menuSection.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'flex';
    if (header) header.style.display = 'flex';

    // Remove existing extra views
    const extraView = document.getElementById('extra-view');
    if (extraView) extraView.remove();

    const currentLang = translator.getLanguage();
    const translations = uiTranslations[currentLang];

    // Update bottom nav active state
    const footerIcons = document.querySelectorAll('nav.fixed.bottom-6 > div, nav.fixed.bottom-6 > a');
    footerIcons.forEach(icon => icon.classList.remove('text-primary'));
    footerIcons.forEach(icon => icon.classList.add('text-gray-400'));

    switch (state.currentView) {
        case 'menu':
            if (footerIcons[0]) {
                footerIcons[0].classList.add('text-primary');
                footerIcons[0].classList.remove('text-gray-400');
            }
            if (searchSection) searchSection.style.display = 'block';
            if (categoryNav) categoryNav.style.display = 'block';
            if (menuSection) menuSection.style.display = 'block';
            renderCategories();
            applyFilters();
            window.scrollTo(0, 0);
            break;

        case 'cart':
            if (header) header.style.display = 'none';
            if (bottomNav) bottomNav.style.display = 'none';
            
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

        case 'favorites':
            if (footerIcons[1]) {
                footerIcons[1].classList.add('text-primary');
                footerIcons[1].classList.remove('text-gray-400');
            }
            if (header) header.style.display = 'none';
            if (bottomNav) bottomNav.style.display = 'none';

            const favPage = document.createElement('div');
            favPage.id = 'extra-view';
            favPage.appendChild(createFavoritesPage(
                state.favorites,
                currentLang,
                translations,
                toggleFavorite,
                addToCart,
                () => showView('menu')
            ));
            main.parentElement.appendChild(favPage);
            break;
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
