/**
 * Jua Café - Menu Data
 */

export const menuItems = [
    {
        id: 1,
        name: { so: "Bun Dhaqameed", en: "Traditional Buna" },
        category: "Drinks",
        price: 45,
        image: "images/traditional_buna_coffee_1776858587628.png",
        description: {
            so: "Bun Itoobiyaan ah oo lagu kariyey dheriga dhoobada (Jebena).",
            en: "Freshly roasted Ethiopian coffee brewed in a clay pot (Jebena)."
        },
        isPopular: true,
        rating: 4.8,
        prepTime: "5-10"
    },
    {
        id: 2,
        name: { so: "Sambuus Hilib", en: "Beef Sambusa" },
        category: "Snacks",
        price: 50,
        image: "images/beef_sambusa_plate_1776858606059.png",
        description: {
            so: "Sambuus lagu soo buuxiyey hilib lo'aad oo la soo miiray iyo basbaas cagaaran.",
            en: "Crispy pastry filled with spiced minced beef and green chili."
        },
        isPopular: true,
        rating: 4.6,
        prepTime: "10-15"
    },
    {
        id: 3,
        name: { so: "Canjeero Firfir", en: "Injera Firfir" },
        category: "Food",
        price: 125,
        image: "images/injera_firfir_dish_1776858644046.png",
        description: {
            so: "Canjeero la googooyey oo lagu kariyey maraqa berbere iyo xawaash.",
            en: "Torn injera pieces sautéed in berbere sauce and spices."
        },
        isPopular: false,
        rating: 4.7,
        prepTime: "15-20"
    },
    {
        id: 4,
        name: { so: "Sambuus Misir", en: "Lentil Sambusa" },
        category: "Snacks",
        price: 40,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=60&w=300",
        description: {
            so: "Sambuus ku habboon dadka khudaarta cuna oo lagu buuxiyey misir basbaas leh.",
            en: "Vegan-friendly pastry filled with spiced brown lentils."
        },
        isPopular: false,
        rating: 4.5,
        prepTime: "10-15"
    },
    {
        id: 5,
        name: { so: "Shaah Carfaaya", en: "Shahi (Spiced Tea)" },
        category: "Drinks",
        price: 35,
        image: "images/shahi_spiced_tea_1776859669091.png",
        description: {
            so: "Shaah madow oo lagu daray hayl, qorfe, iyo qaranfuul.",
            en: "Black tea infused with cardamom, cinnamon, and cloves."
        },
        isPopular: false,
        rating: 4.9,
        prepTime: "5-8"
    },
    {
        id: 6,
        name: { so: "Casiir Miro", en: "Fruit Juice" },
        category: "Drinks",
        price: 60,
        image: "https://images.unsplash.com/photo-1536599424071-0b215a388ba7?auto=format&fit=crop&q=60&w=300",
        description: {
            so: "Casiir dabiici ah oo laga tuujiyey miro xilliyeed kala duwan.",
            en: "Freshly squeezed seasonal fruit juice blend."
        },
        isPopular: false,
        rating: 4.7,
        prepTime: "5-10"
    },
    {
        id: 7,
        name: { so: "Baqlawa", en: "Baklava" },
        category: "Desserts",
        price: 80,
        image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=60&w=300",
        description: {
            so: "Macmacaan ka samaysan lakabyo filo ah oo lagu buuxiyey nuts la jarjaray.",
            en: "Sweet pastry made of layers of filo filled with chopped nuts."
        },
        isPopular: true,
        rating: 4.8,
        prepTime: "5-10"
    },
    {
        id: 8,
        name: { so: "Burger Khudrad", en: "Vegetable Burger" },
        category: "Food",
        price: 150,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=60&w=300",
        description: {
            so: "Burger ka samaysan misir, khudaar cusub iyo suugo gaar ah.",
            en: "House-made lentil patty with fresh veggies and special sauce."
        },
        isPopular: false,
        rating: 4.4,
        prepTime: "15-25"
    }
];

export const categories = [
    { id: "All", so: "Dhammaan", en: "All" },
    { id: "Drinks", so: "Cabitaanno", en: "Drinks" },
    { id: "Food", so: "Cunto", en: "Food" },
    { id: "Snacks", so: "Cunto Fudud", en: "Snacks" },
    { id: "Desserts", so: "Macmacaan", en: "Desserts" }
];

export const uiTranslations = {
    so: {
        heroSubtitle: "Guri Dhab ah",
        heroTitle: "Ku soo dhawaada Munaasabadda Bunka",
        menuTab: "Menu",
        favoritesTab: "Jeceylka",
        historyTab: "Taariikh",
        popularLabel: "Caan",
        noItems: "Wax alaabo ah laguma helin qaybtan.",
        currency: "ETB",
        searchPlaceholder: "Raadi cunto ama cabitaan...",
        searchNoResults: "Wax natiijo ah laguma helin raadintaada.",
        addToCart: "Ku dar",
        min: "daqiiqo",
        cartTitle: "Gaarigaaga",
        total: "Warta Guud",
        checkout: "Dalbo",
        emptyCart: "Gaarigaagu waa maran yahay",
        back: "Dib u laabo",
        items: "alaab",
        confirmCheckout: "Ma hubaal inaad rabto inaad dalbato?"
    },
    en: {
        heroSubtitle: "Authentic Hearth",
        heroTitle: "Welcome to the Coffee Ceremony",
        menuTab: "Menu",
        favoritesTab: "Favorites",
        historyTab: "History",
        popularLabel: "Popular",
        noItems: "No items found in this category.",
        currency: "ETB",
        searchPlaceholder: "Search dishes, restaurants...",
        searchNoResults: "No results found for your search.",
        addToCart: "Add to cart",
        min: "min",
        cartTitle: "Your Cart",
        total: "Grand Total",
        checkout: "Checkout",
        emptyCart: "Your cart is empty",
        back: "Back",
        items: "items",
        confirmCheckout: "Are you sure you want to checkout?"
    }
};
