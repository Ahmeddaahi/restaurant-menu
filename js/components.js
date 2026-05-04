/**
 * Jua Café - UI Components
 */

export function createItemCard(
  item,
  lang,
  index,
  translations,
  onAddToCart,
  onShowDetails,
) {
  const card = document.createElement("div");
  card.className = `item-card flex flex-col fade-in cursor-pointer`;
  card.style.animationDelay = `${index * 0.05}s`;

  card.onclick = () => onShowDetails(item);

  card.innerHTML = `
        <div class="relative overflow-hidden img-placeholder">
            <img src="${item.image}" 
                 alt="${item.name[lang]}" 
                 class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                 loading="${index < 4 ? 'eager' : 'lazy'}" 
                 fetchpriority="${index < 4 ? 'high' : 'auto'}"
                 decoding="async"
                 onload="this.parentElement.classList.add('loaded')">
            <button class="favorite-btn ${item.isFavorite ? "active" : ""}" id="fav-${item.id}" aria-label="${item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="${item.isFavorite ? "currentColor" : "none"}" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                <span class="text-gray-900 font-bold text-base">${translations.currency} ${item.price}</span>
                <button class="add-btn" id="add-${item.id}" aria-label="Add ${item.name[lang]} to cart">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
    onAddToCart(item, e);
  };

  const favBtn = card.querySelector(`#fav-${item.id}`);
  favBtn.onclick = (e) => {
    e.stopPropagation();
    const icon = favBtn.querySelector("svg");
    const isActive = favBtn.classList.toggle("active");
    icon.setAttribute("fill", isActive ? "currentColor" : "none");
    onToggleFavorite(item);
  };

  return card;
}

export function createCategoryTab(cat, lang, isActive, onClick) {
  const btn = document.createElement("button");
  btn.className = `category-tab flex-shrink-0 px-5 py-2 rounded-2xl text-[13px] font-semibold ${isActive ? "active" : ""}`;
  btn.textContent = cat[lang];
  btn.onclick = onClick;
  return btn;
}

export function createCartPage(
  cartItems,
  lang,
  translations,
  onUpdateQty,
  onRemove,
  onBack,
  onCheckout,
) {
  const container = document.createElement("div");
  container.className =
    "px-6 py-8 fade-in space-y-8 min-h-screen bg-[#F8F9FA] md:px-10 lg:px-14";

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemLabel =
    cartItems.length === 1
      ? translations.item || translations.items
      : translations.items;

  let itemsHtml = "";
  if (cartItems.length === 0) {
    itemsHtml = `
            <div class="bg-white rounded-[2rem] shadow-xl p-10 text-center space-y-6">
                <div class="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <p class="text-gray-600 text-sm">${translations.emptyCart}</p>
                <button class="text-primary font-bold" id="cart-back-btn-empty">${translations.back}</button>
            </div>
        `;
  } else {
    itemsHtml = cartItems
      .map(
        (item) => `
            <div class="cart-item-card bg-white rounded-[2rem] shadow-sm p-4 md:p-5 grid grid-cols-[80px_1fr] gap-4 items-center animate-slide-up">
                <div class="relative overflow-hidden rounded-3xl bg-gray-100 w-full h-20">
                    <img src="${item.image}" class="w-full h-full object-cover">
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-start gap-3">
                        <div>
                            <h4 class="text-base font-bold text-gray-900">${item.name[lang]}</h4>
                            <p class="text-sm text-gray-500 mt-1">${item.quantity} × ${translations.currency} ${item.price}</p>
                        </div>
                        <button class="text-gray-400 hover:text-primary transition-colors" aria-label="Remove ${item.name[lang]} from cart" onclick="this.dispatchEvent(new CustomEvent('remove-item', {bubbles: true, detail: '${item.id}'}))">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span class="text-primary font-semibold text-lg">${translations.currency} ${(item.price * item.quantity).toFixed(2)}</span>
                        <div class="flex items-center gap-2 bg-gray-100 rounded-full p-1.5">
                            <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 transition-colors" aria-label="Decrease quantity" onclick="this.dispatchEvent(new CustomEvent('update-qty', {bubbles: true, detail: {id: '${item.id}', delta: -1}}))">-</button>
                            <span class="w-10 text-center text-sm font-semibold">${item.quantity}</span>
                            <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 transition-colors" aria-label="Increase quantity" onclick="this.dispatchEvent(new CustomEvent('update-qty', {bubbles: true, detail: {id: '${item.id}', delta: 1}}))">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");

    itemsHtml += `
            <div class="order-summary bg-white rounded-[2rem] shadow-xl p-6 md:p-8 space-y-5">
                <div class="flex justify-between items-center text-gray-600">
                    <span class="font-medium">${translations.total}</span>
                    <span class="text-2xl font-bold text-gray-900">${translations.currency} ${total.toFixed(2)}</span>
                </div>
                <button class="w-full bg-primary text-white py-4 rounded-3xl font-bold shadow-lg shadow-primary/25 active:scale-95 transition-transform" id="checkout-btn">
                    ${translations.checkout}
                </button>
                <button class="w-full text-gray-500 font-bold py-4 rounded-3xl border border-gray-200" id="cart-back-btn">
                    ${translations.back}
                </button>
            </div>
        `;
  }

  container.innerHTML = `
        <div class="flex items-center gap-4 mb-6">
            <button class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-800" id="header-back-btn" aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div>
                <p class="text-sm text-gray-500">${translations.cartTitle}</p>
                <h2 class="text-3xl font-bold text-gray-900">${cartItems.length} ${itemLabel}</h2>
            </div>
        </div>
        <div class="space-y-5">
            ${itemsHtml}
        </div>
    `;

  container.addEventListener("update-qty", (e) =>
    onUpdateQty(e.detail.id, e.detail.delta),
  );
  container.addEventListener("remove-item", (e) => onRemove(e.detail));

  const backBtn = container.querySelector("#cart-back-btn");
  const backBtnHeader = container.querySelector("#header-back-btn");
  const backBtnEmpty = container.querySelector("#cart-back-btn-empty");
  const checkoutBtn = container.querySelector("#checkout-btn");

  if (backBtn) backBtn.onclick = onBack;
  if (backBtnHeader) backBtnHeader.onclick = onBack;
  if (backBtnEmpty) backBtnEmpty.onclick = onBack;
  if (checkoutBtn) checkoutBtn.onclick = onCheckout;

  return container;
}

export function createItemDetailsPage(
  item,
  lang,
  translations,
  onAddToCart,
  onBack,
) {
  const container = document.createElement("div");
  container.className =
    "fixed inset-0 bg-white z-[200] overflow-y-auto flex flex-col fade-in";

  container.innerHTML = `
        <div class="relative h-[45vh] w-full">
            <img src="${item.image}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <button class="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white" id="details-back-btn" aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                    <span class="text-3xl font-bold text-gray-900">${translations.currency} ${item.price}</span>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="text-lg font-bold text-gray-800">About this dish</h3>
                <p class="text-gray-500 leading-relaxed text-sm">
                    ${item.description[lang]}
                </p>
            </div>

            <div class="pt-8 mt-auto">
                <button class="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-3" id="details-add-btn" aria-label="Add ${item.name[lang]} to cart">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    ${translations.addToCart}
                </button>
            </div>
        </div>
    `;

  container.querySelector("#details-back-btn").onclick = onBack;
  container.querySelector("#details-add-btn").onclick = (e) => {
    onAddToCart(item, e);
    onBack();
  };

  return container;
}

export function createFavoritesPage(
  favoriteItems,
  lang,
  translations,
  onToggleFavorite,
  onAddToCart,
  onBack,
) {
  const container = document.createElement("div");
  container.className = "px-6 fade-in space-y-6";

  let itemsHtml = "";
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
            <button class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-800" id="fav-header-back-btn" aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
    const grid = container.querySelector("#fav-grid");
    favoriteItems.forEach((item, index) => {
      const card = createItemCard(
        { ...item, isFavorite: true },
        lang,
        index,
        translations,
        onAddToCart,
        () => {},
      );
      // Re-bind favorite toggle to refresh view
      const favBtn = card.querySelector(".favorite-btn");
      favBtn.onclick = (e) => {
        e.stopPropagation();
        onToggleFavorite(item);
      };
      grid.appendChild(card);
    });
  }

  const backBtn = container.querySelector("#fav-back-btn");
  const backBtnHeader = container.querySelector("#fav-header-back-btn");
  const backBtnEmpty = container.querySelector("#fav-back-btn-empty");

  if (backBtn) backBtn.onclick = onBack;
  if (backBtnHeader) backBtnHeader.onclick = onBack;
  if (backBtnEmpty) backBtnEmpty.onclick = onBack;

  return container;
}

export function createAboutPage(lang, translations, onBack) {
  const container = document.createElement("div");
  container.className =
    "px-6 py-8 fade-in space-y-10 min-h-screen bg-[#F8F9FA] md:px-10 lg:px-14 pb-24";

  container.innerHTML = `
        <div class="flex items-center gap-4 mb-6">
            <button class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-800" id="about-back-btn" aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div>
                <p class="text-sm text-gray-500">${translations.aboutTab}</p>
                <h2 class="text-3xl font-bold text-gray-900">${translations.aboutTab}</h2>
            </div>
        </div>

        <div class="grid gap-6">
            <div class="relative overflow-hidden rounded-[2rem] shadow-2xl h-72 md:h-96 about-hero-card">
                <img src="images/de44e0ea-d57c-44d7-8f91-24b0f07a46a0.webp" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-6 flex flex-col justify-end">
                    <span class="text-[11px] uppercase tracking-[0.3em] text-accent font-bold">Premium local menu</span>
                    <h3 class="mt-3 text-3xl font-bold text-white leading-tight">${translations.heroTitle}</h3>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div class="grid gap-6">
                    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 uppercase tracking-[0.3em] font-semibold">${translations.aboutWho}</p>
                                <h4 class="text-xl font-bold text-gray-900">${translations.aboutWho}</h4>
                            </div>
                        </div>
                        <p class="text-gray-500 text-sm leading-relaxed">${translations.aboutWhoDesc}</p>
                    </div>

                    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-3xl bg-orange-100 flex items-center justify-center text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 uppercase tracking-[0.3em] font-semibold">${translations.aboutServe}</p>
                                <h4 class="text-xl font-bold text-gray-900">${translations.aboutServe}</h4>
                            </div>
                        </div>
                        <p class="text-gray-500 text-sm leading-relaxed">${translations.aboutServeDesc}</p>
                    </div>
                </div>

                <div class="grid gap-6">
                    <div class="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
                        <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600" class="w-full h-56 object-cover">
                        <div class="p-5 space-y-3">
                            <h4 class="text-lg font-bold text-gray-900">Spiced Tradition</h4>
                            <p class="text-gray-500 text-sm leading-relaxed">Warm cups, authentic flavors, and a cozy café experience in every sip.</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
                        <img src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=600" class="w-full h-56 object-cover">
                        <div class="p-5 space-y-3">
                            <h4 class="text-lg font-bold text-gray-900">Fresh Local Taste</h4>
                            <p class="text-gray-500 text-sm leading-relaxed">Inspired by local ingredients, crafted for bright and nourishing meals.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 space-y-6">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm text-gray-500 uppercase tracking-[0.3em] font-semibold">${translations.contactUs}</p>
                        <h4 class="text-2xl font-bold text-gray-900">${translations.contactUs}</h4>
                    </div>
                    <div class="rounded-3xl bg-primary/10 px-4 py-2 text-primary font-bold">Open Daily</div>
                </div>

                <div class="grid gap-4">
                    <a href="https://maps.app.goo.gl/UHosYf9yacEhjLCv8" target="_blank" class="flex items-center gap-4 rounded-3xl border border-gray-100 p-4 hover:border-primary transition-colors bg-gray-50">
                        <div class="w-12 h-12 bg-white rounded-3xl flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase tracking-[0.24em]">${translations.location}</p>
                            <p class="text-sm font-semibold">${translations.address}</p>
                        </div>
                    </a>

                    <a href="tel:+251915740101" class="flex items-center gap-4 rounded-3xl border border-gray-100 p-4 hover:border-primary transition-colors bg-gray-50">
                        <div class="w-12 h-12 bg-white rounded-3xl flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase tracking-[0.24em]">${translations.phone}</p>
                            <p class="text-sm font-semibold">+251 91 574 0101</p>
                        </div>
                    </a>

                    <a href="https://wa.me/251915740101" target="_blank" class="flex items-center gap-4 rounded-3xl border border-gray-100 p-4 hover:border-green-500 transition-colors bg-gray-50">
                        <div class="w-12 h-12 bg-white rounded-3xl flex items-center justify-center text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.435-9.89 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.744-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase tracking-[0.24em]">${translations.whatsapp}</p>
                            <p class="text-sm font-semibold">WhatsApp Us</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `;

  container.querySelector("#about-back-btn").onclick = onBack;

  return container;
}
