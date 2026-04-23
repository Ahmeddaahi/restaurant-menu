/**
 * Jua Café - UI Components
 */

/**
 * Creates a menu item card element
 * @param {Object} item 
 * @param {string} lang 
 * @param {number} index 
 * @param {Object} translations 
 * @returns {HTMLElement}
 */
export function createItemCard(item, lang, index, translations) {
    const card = document.createElement('div');
    card.className = `item-card bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 flex flex-col fade-in`;
    card.style.animationDelay = `${index * 0.02}s`;

    card.innerHTML = `
        <div class="relative h-40 overflow-hidden img-placeholder">
            <img src="${item.image}" 
                 alt="${item.name[lang]}" 
                 class="w-full h-full object-cover transform-gpu" 
                 loading="lazy" 
                 decoding="async"
                 onload="this.classList.add('loaded')">
            ${item.isPopular ? `
                <div class="absolute top-3 left-3 bg-brand-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    ${translations.popularLabel}
                </div>
            ` : ''}
            <button class="absolute bottom-3 right-3 w-8 h-8 bg-brand-primary/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
        <div class="p-4 flex flex-col flex-grow">
            <h3 class="font-bold text-gray-800 text-sm leading-tight mb-1">${item.name[lang]}</h3>
            <p class="text-gray-400 text-[11px] leading-snug flex-grow mb-2 line-clamp-2">${item.description[lang]}</p>
            <div class="flex items-center justify-between mt-auto">
                <span class="text-brand-primary font-bold text-sm">${item.price} <span class="text-[10px] text-gray-400 font-normal">${translations.currency}</span></span>
            </div>
        </div>
    `;
    return card;
}

/**
 * Creates a category tab button element
 * @param {Object} cat 
 * @param {string} lang 
 * @param {boolean} isActive 
 * @param {Function} onClick 
 * @returns {HTMLElement}
 */
export function createCategoryTab(cat, lang, isActive, onClick) {
    const btn = document.createElement('button');
    btn.className = `category-tab flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all ${isActive ? 'active' : 'bg-white border border-gray-100'}`;
    btn.textContent = cat[lang];
    btn.onclick = onClick;
    return btn;
}
