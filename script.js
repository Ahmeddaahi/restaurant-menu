/**
 * Jua Café - Menu Data & Logic
 */

const menuItems = [
    {
        id: 1,
        name: "Traditional Buna",
        category: "Drinks",
        price: 45,
        image: "traditional_buna_coffee_1776858587628.png",
        description: "Freshly roasted Ethiopian coffee brewed in a clay pot (Jebena).",
        isPopular: true
    },
    {
        id: 2,
        name: "Beef Sambusa",
        category: "Snacks",
        price: 50,
        image: "beef_sambusa_plate_1776858606059.png",
        description: "Crispy pastry filled with spiced minced beef and green chili.",
        isPopular: true
    },
    {
        id: 3,
        name: "Injera Firfir",
        category: "Food",
        price: 125,
        image: "injera_firfir_dish_1776858644046.png",
        description: "Torn injera pieces sautéed in berbere sauce and spices.",
        isPopular: false
    },
    {
        id: 4,
        name: "Lentil Sambusa",
        category: "Snacks",
        price: 40,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400",
        description: "Vegan-friendly pastry filled with spiced brown lentils.",
        isPopular: false
    },
    {
        id: 5,
        name: "Shahi (Spiced Tea)",
        category: "Drinks",
        price: 35,
        image: "https://images.unsplash.com/photo-1544787210-2213d84ad960?auto=format&fit=crop&q=80&w=400",
        description: "Black tea infused with cardamom, cinnamon, and cloves.",
        isPopular: false
    },
    {
        id: 6,
        name: "Fruit Juice",
        category: "Drinks",
        price: 60,
        image: "https://images.unsplash.com/photo-1536599424071-0b215a388ba7?auto=format&fit=crop&q=80&w=400",
        description: "Freshly squeezed seasonal fruit juice blend.",
        isPopular: false
    },
    {
        id: 7,
        name: "Baklava",
        category: "Desserts",
        price: 80,
        image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=400",
        description: "Sweet pastry made of layers of filo filled with chopped nuts.",
        isPopular: true
    },
    {
        id: 8,
        name: "Vegetable Burger",
        category: "Food",
        price: 150,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400",
        description: "House-made lentil patty with fresh veggies and special sauce.",
        isPopular: false
    }
];

const categories = ["All", "Drinks", "Food", "Snacks", "Desserts"];
let activeCategory = "All";

/**
 * Initialize the App
 */
function init() {
    renderCategories();
    renderMenu(menuItems);
}

/**
 * Render Category Tabs
 */
function renderCategories() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = `category-tab flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all ${category === activeCategory ? 'active' : 'bg-white border border-gray-100'}`;
        btn.textContent = category;
        btn.onclick = () => filterCategory(category);
        categoryList.appendChild(btn);
    });
}

/**
 * Filter Menu by Category
 */
function filterCategory(category) {
    activeCategory = category;
    renderCategories();

    const filteredItems = category === "All" 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    renderMenu(filteredItems);

    // Smooth scroll back to menu grid if scrolled down
    const nav = document.getElementById('category-nav');
    nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Render Menu Items
 */
function renderMenu(items) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p class="col-span-2 text-center text-gray-400 py-10">No items found in this category.</p>';
        return;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `item-card bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 flex flex-col fade-in`;
        card.style.animationDelay = `${index * 0.05}s`;

        card.innerHTML = `
            <div class="relative h-40 overflow-hidden">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                ${item.isPopular ? `
                    <div class="absolute top-3 left-3 bg-brand-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Popular
                    </div>
                ` : ''}
                <button class="absolute bottom-3 right-3 w-8 h-8 bg-brand-primary/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="font-bold text-gray-800 text-sm leading-tight mb-1">${item.name}</h3>
                <p class="text-gray-400 text-[11px] leading-snug flex-grow mb-2 line-clamp-2">${item.description}</p>
                <div class="flex items-center justify-between mt-auto">
                    <span class="text-brand-primary font-bold text-sm">${item.price} <span class="text-[10px] text-gray-400 font-normal">ETB</span></span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
