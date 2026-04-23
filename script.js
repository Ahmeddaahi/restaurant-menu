/**
 * Jua Café - Main Application Logic (Controller)
 */

import { menuItems, categories, uiTranslations } from './js/data.js';
import { translator } from './js/translations.js';
import { createItemCard, createCategoryTab } from './js/components.js';

// Load data from localStorage or fallback to default
const savedItems = localStorage.getItem('customMenuItems');
const initialMenuItems = savedItems ? JSON.parse(savedItems) : menuItems;

// Application State
const state = {
    activeCategory: "All",
    searchTerm: "",
    menuData: initialMenuItems
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
    
    renderCategories();
    applyFilters();
};

/**
 * Initialize the App
 */
function init() {
    renderCategories();
    renderMenu(state.menuData);
    translator.updateStaticText();
    translator.updateLanguageButtons();
    updateSearchPlaceholder();

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
}

/**
 * Render Category Tabs
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
 * Update Search Placeholder based on current language
 */
function updateSearchPlaceholder() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = translator.translate('searchPlaceholder');
    }
}

/**
 * Filter Menu by Category
 */
function filterCategory(category) {
    state.activeCategory = category;
    renderCategories();
    applyFilters();

    // Scroll back to category nav if we've scrolled down
    if (window.scrollY > 200) {
        const nav = document.getElementById('category-nav');
        if (nav) nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Unified filter logic for Category and Search
 */
function applyFilters() {
    const { activeCategory, searchTerm, menuData } = state;

    const filteredItems = menuData.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        
        if (!searchTerm) return matchesCategory;

        // Search in both Somali and English (Name and Description)
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
 * Render Menu Items
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
        const card = createItemCard(item, currentLang, index, translations);
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);

    // Ensure cached images or fast-loading images trigger the 'loaded' state
    // Use a small delay to ensure DOM is ready on older devices
    setTimeout(() => {
        grid.querySelectorAll('img').forEach(img => {
            const handleLoad = () => {
                img.parentElement.classList.add('loaded');
            };

            const handleError = () => {
                img.parentElement.classList.add('loaded', 'error');
                img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=60&w=300'; // Fallback
            };

            if (img.complete) {
                handleLoad();
            } else {
                img.onload = handleLoad;
                img.onerror = handleError;
            }
        });
    }, 50);
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
