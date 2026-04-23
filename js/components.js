export function createItemCard(item, lang, index, translations) {
    const card = document.createElement('div');
    card.className = `item-card flex flex-col fade-in`;
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
        <div class="relative overflow-hidden img-placeholder">
            <img src="${item.image}" 
                 alt="${item.name[lang]}" 
                 class="w-full h-full object-cover" 
                 loading="lazy" 
                 decoding="async"
                 onload="this.parentElement.classList.add('loaded')">
        </div>
        <div class="p-3 flex flex-col flex-grow">
            <div class="flex items-center gap-2 mb-1">
                <div class="flex items-center gap-1 text-[10px] text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>${item.prepTime} ${translations.min}</span>
                </div>
                <div class="rating-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <span>${item.rating}</span>
                </div>
            </div>
            <h3 class="font-bold text-gray-800 text-[13px] leading-tight mb-2 line-clamp-1">${item.name[lang]}</h3>
            <div class="flex items-center justify-between mt-auto">
                <span class="text-gray-900 font-bold text-base">$${item.price}</span>
                <button class="add-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>${translations.addToCart}</span>
                </button>
            </div>
        </div>
    `;
    return card;
}

export function createCategoryTab(cat, lang, isActive, onClick) {
    const btn = document.createElement('button');
    btn.className = `category-tab flex-shrink-0 px-5 py-2 rounded-2xl text-[13px] font-semibold ${isActive ? 'active' : ''}`;
    btn.textContent = cat[lang];
    btn.onclick = onClick;
    return btn;
}
