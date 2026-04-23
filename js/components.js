/**
 * Jua Café - UI Components
 */

export function createItemCard(item, lang, index, translations, onAddToCart, onShowDetails) {
    const card = document.createElement('div');
    card.className = `item-card flex flex-col fade-in cursor-pointer`;
    card.style.animationDelay = `${index * 0.05}s`;

    card.onclick = () => onShowDetails(item);

    card.innerHTML = `
        <div class="relative overflow-hidden img-placeholder">
            <img src="${item.image}" 
                 alt="${item.name[lang]}" 
                 class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                 loading="lazy" 
                 decoding="async"
                 onload="this.parentElement.classList.add('loaded')">
            <button class="favorite-btn ${item.isFavorite ? 'active' : ''}" id="fav-${item.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="${item.isFavorite ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
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
                <button class="add-btn" id="add-${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>${translations.addToCart}</span>
                </button>
            </div>
        </div>
    `;

    const addBtn = card.querySelector(`#add-${item.id}`);
    addBtn.onclick = (e) => {
        e.stopPropagation();
        onAddToCart(item);
    };

    const favBtn = card.querySelector(`#fav-${item.id}`);
    favBtn.onclick = (e) => {
        e.stopPropagation();
        const icon = favBtn.querySelector('svg');
        const isActive = favBtn.classList.toggle('active');
        icon.setAttribute('fill', isActive ? 'currentColor' : 'none');
        onToggleFavorite(item);
    };

    return card;
}

export function createCategoryTab(cat, lang, isActive, onClick) {
    const btn = document.createElement('button');
    btn.className = `category-tab flex-shrink-0 px-5 py-2 rounded-2xl text-[13px] font-semibold ${isActive ? 'active' : ''}`;
    btn.textContent = cat[lang];
    btn.onclick = onClick;
    return btn;
}

export function createCartPage(cartItems, lang, translations, onUpdateQty, onRemove, onBack, onCheckout) {
    const container = document.createElement('div');
    container.className = 'px-6 fade-in space-y-6';

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let itemsHtml = '';
    if (cartItems.length === 0) {
        itemsHtml = `
            <div class="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <p class="font-medium">${translations.emptyCart}</p>
                <button class="text-primary font-bold" id="cart-back-btn-empty">${translations.back}</button>
            </div>
        `;
    } else {
        itemsHtml = cartItems.map(item => `
            <div class="flex gap-4 bg-white p-4 rounded-2xl shadow-sm animate-slide-up">
                <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="${item.image}" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow flex flex-col justify-between py-1">
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold text-gray-800 text-sm">${item.name[lang]}</h4>
                        <button class="text-gray-400 hover:text-primary transition-colors" onclick="this.dispatchEvent(new CustomEvent('remove-item', {bubbles: true, detail: ${item.id}}))">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-primary">$${item.price}</span>
                        <div class="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <button class="w-6 h-6 flex items-center justify-center text-gray-500 font-bold" onclick="this.dispatchEvent(new CustomEvent('update-qty', {bubbles: true, detail: {id: ${item.id}, delta: -1}}))">-</button>
                            <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                            <button class="w-6 h-6 flex items-center justify-center text-gray-500 font-bold" onclick="this.dispatchEvent(new CustomEvent('update-qty', {bubbles: true, detail: {id: ${item.id}, delta: 1}}))">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        itemsHtml += `
            <div class="bg-white p-6 rounded-3xl shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span class="text-gray-500 font-medium">${translations.total}</span>
                    <span class="text-2xl font-bold text-gray-900">$${total.toFixed(2)}</span>
                </div>
                <button class="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform" id="checkout-btn">
                    ${translations.checkout}
                </button>
                <button class="w-full text-gray-500 font-bold py-2" id="cart-back-btn">
                    ${translations.back}
                </button>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="flex items-center gap-4 mb-6">
            <button class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-800" id="header-back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h2 class="text-2xl font-bold text-gray-900">${translations.cartTitle}</h2>
        </div>
        <div class="space-y-4">
            ${itemsHtml}
        </div>
    `;

    // Event Delegation for dynamic items
    container.addEventListener('update-qty', (e) => onUpdateQty(e.detail.id, e.detail.delta));
    container.addEventListener('remove-item', (e) => onRemove(e.detail));

    const backBtn = container.querySelector('#cart-back-btn');
    const backBtnHeader = container.querySelector('#header-back-btn');
    const backBtnEmpty = container.querySelector('#cart-back-btn-empty');
    const checkoutBtn = container.querySelector('#checkout-btn');

    if (backBtn) backBtn.onclick = onBack;
    if (backBtnHeader) backBtnHeader.onclick = onBack;
    if (backBtnEmpty) backBtnEmpty.onclick = onBack;
    if (checkoutBtn) checkoutBtn.onclick = onCheckout;

    return container;
}

export function createItemDetailsPage(item, lang, translations, onAddToCart, onBack) {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 bg-white z-[200] overflow-y-auto flex flex-col fade-in';

    container.innerHTML = `
        <div class="relative h-[45vh] w-full">
            <img src="${item.image}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <button class="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white" id="details-back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div class="absolute bottom-6 left-6 right-6">
                <div class="flex justify-between items-end text-white">
                    <div class="space-y-1">
                        <div class="bg-primary/90 text-white text-[10px] font-bold px-3 py-1 rounded-full inline-block uppercase tracking-wider">
                            ${item.category}
                        </div>
                        <h2 class="text-3xl font-bold">${item.name[lang]}</h2>
                    </div>
                    <div class="rating-badge !bg-white/20 backdrop-blur-md !text-white !border-none px-3 py-1.5 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current text-yellow-400" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        <span class="font-bold">${item.rating}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-grow bg-white -mt-6 rounded-t-[32px] p-8 space-y-8 shadow-2xl relative z-10">
            <div class="flex justify-between items-center">
                <div class="flex gap-6">
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span class="text-[10px] text-gray-400 font-medium">${item.prepTime} ${translations.min}</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-[10px] text-gray-400 font-medium">Halal</span>
                    </div>
                </div>
                <div class="text-right">
                    <span class="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Price</span>
                    <span class="text-3xl font-bold text-gray-900">$${item.price}</span>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="text-lg font-bold text-gray-800">About this dish</h3>
                <p class="text-gray-500 leading-relaxed text-sm">
                    ${item.description[lang]}
                </p>
            </div>

            <div class="pt-8 mt-auto">
                <button class="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-3" id="details-add-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    ${translations.addToCart}
                </button>
            </div>
        </div>
    `;

    container.querySelector('#details-back-btn').onclick = onBack;
    container.querySelector('#details-add-btn').onclick = () => {
        onAddToCart(item);
        onBack();
    };

    return container;
}

export function createFavoritesPage(favoriteItems, lang, translations, onToggleFavorite, onAddToCart, onBack) {
    const container = document.createElement('div');
    container.className = 'px-6 fade-in space-y-6';

    let itemsHtml = '';
    if (favoriteItems.length === 0) {
        itemsHtml = `
            <div class="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <p class="font-medium">${translations.favoritesTab} is empty</p>
                <button class="text-primary font-bold" id="fav-back-btn-empty">${translations.back}</button>
            </div>
        `;
    } else {
        itemsHtml = `
            <div class="grid grid-cols-2 gap-x-4 gap-y-6" id="fav-grid">
                <!-- Items will be injected here -->
            </div>
            <button class="w-full text-gray-500 font-bold py-8" id="fav-back-btn">
                ${translations.back}
            </button>
        `;
    }

    container.innerHTML = `
        <div class="flex items-center gap-4 mb-6">
            <button class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-800" id="fav-header-back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h2 class="text-2xl font-bold text-gray-900">${translations.favoritesTab}</h2>
        </div>
        <div id="fav-content">
            ${itemsHtml}
        </div>
    `;

    if (favoriteItems.length > 0) {
        const grid = container.querySelector('#fav-grid');
        favoriteItems.forEach((item, index) => {
            const card = createItemCard(
                { ...item, isFavorite: true },
                lang,
                index,
                translations,
                onAddToCart,
                () => { }
            );
            // Re-bind favorite toggle to refresh view
            const favBtn = card.querySelector('.favorite-btn');
            favBtn.onclick = (e) => {
                e.stopPropagation();
                onToggleFavorite(item);
            };
            grid.appendChild(card);
        });
    }

    const backBtn = container.querySelector('#fav-back-btn');
    const backBtnHeader = container.querySelector('#fav-header-back-btn');
    const backBtnEmpty = container.querySelector('#fav-back-btn-empty');

    if (backBtn) backBtn.onclick = onBack;
    if (backBtnHeader) backBtnHeader.onclick = onBack;
    if (backBtnEmpty) backBtnEmpty.onclick = onBack;

    return container;
}
