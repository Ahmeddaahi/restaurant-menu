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
    },
    {
        id: 9,
        name: { so: "Salmon la Dubay", en: "Grilled Salmon" },
        category: "Food",
        price: 350,
        image: "images/grilled_salmon.png",
        description: {
            so: "Fillet salmon ah oo la dubay, laguna daray khudaar iyo liin dhanaan.",
            en: "Premium grilled salmon fillet served with roasted vegetables and lemon butter sauce."
        },
        isPopular: true,
        rating: 4.9,
        prepTime: "20-25"
    },
    {
        id: 10,
        name: { so: "Casiir Cambe", en: "Mango Smoothie" },
        category: "Drinks",
        price: 75,
        image: "images/mango_smoothie.png",
        description: {
            so: "Casiir cambe cusub oo leh labeen iyo baraf.",
            en: "Creamy and refreshing mango smoothie made with fresh tropical mangoes."
        },
        isPopular: true,
        rating: 4.8,
        prepTime: "5-10"
    },
    {
        id: 11,
        name: { so: "Digaag Tikka", en: "Chicken Tikka" },
        category: "Food",
        price: 220,
        image: "images/chicken_tikka.png",
        description: {
            so: "Cadad digaag ah oo lagu daray xawaashka tikka iyo yogurt, laguna dubay foornada.",
            en: "Tender chicken pieces marinated in tikka spices and yogurt, grilled to perfection."
        },
        isPopular: true,
        rating: 4.7,
        prepTime: "15-20"
    },
    {
        id: 12,
        name: { so: "Rooti iyo Afakaado", en: "Avocado Toast" },
        category: "Snacks",
        price: 110,
        image: "images/avocado_toast.png",
        description: {
            so: "Rooti la dubay oo lagu dul daray afakaado la jajabiyey iyo ukun.",
            en: "Toasted sourdough topped with smashed avocado, cherry tomatoes, and a poached egg."
        },
        isPopular: false,
        rating: 4.6,
        prepTime: "10-12"
    },
    {
        id: 13,
        name: { so: "Bun Qabow oo Karamell leh", en: "Iced Caramel Macchiato" },
        category: "Drinks",
        price: 90,
        image: "https://images.unsplash.com/photo-1572286258217-40142c1c6a70?auto=format&fit=crop&q=80&w=600",
        description: {
            so: "Bun qabow oo lagu daray caano, vanila, iyo suugo karamell ah.",
            en: "Chilled espresso with creamy milk, vanilla syrup, and a rich caramel drizzle."
        },
        isPopular: false,
        rating: 4.8,
        prepTime: "5-7"
    },
    {
        id: 14,
        name: { so: "Keeg Shukulaato ah", en: "Chocolate Lava Cake" },
        category: "Desserts",
        price: 120,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=600",
        description: {
            so: "Keeg shukulaato ah oo leh shukulaato dhexda ka dareeraysa.",
            en: "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream."
        },
        isPopular: true,
        rating: 4.9,
        prepTime: "12-15"
    },
    {
        id: 15,
        name: { so: "Salad Caesar", en: "Caesar Salad" },
        category: "Food",
        price: 130,
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600",
        description: {
            so: "Salaad cusub oo leh digaag la dubay, farmaajo, iyo rooti la dubay.",
            en: "Crisp romaine lettuce with grilled chicken, parmesan cheese, and garlic croutons."
        },
        isPopular: false,
        rating: 4.5,
        prepTime: "10-15"
    },
    {
        id: 16,
        name: { so: "Liin iyo Reexaan", en: "Mint Lemonade" },
        category: "Drinks",
        price: 50,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
        description: {
            so: "Cabitaan liin dhanaan ah oo lagu daray caleemo reexaan ah oo cusub.",
            en: "Zesty fresh lemonade infused with cool mint leaves and ice."
        },
        isPopular: false,
        rating: 4.7,
        prepTime: "5-8"
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
        heroSubtitle: "Cusub & Caafimaad",
        heroTitle: "Ku soo dhawaada Casiirka Cusub ee Nadi's",
        menuTab: "Menu",
        aboutTab: "Nagu Saabsan",
        popularLabel: "Caan",
        noItems: "Wax alaabo ah laguma helin qaybtan.",
        currency: "ETB",
        searchPlaceholder: "Raadi cunto ama cabitaan...",
        searchNoResults: "Wax natiijo ah laguma helin raadintaada.",
        aboutWho: "Waa Ayo Nadi's?",
        aboutWhoDesc: "Casiirka Cusub ee Nadi's waa goob heer sare ah oo ku taal Jigjiga, looguna talagalay dadka jecel cuntada caafimaadka leh iyo cabitaannada dabiiciga ah.",
        aboutServe: "Maxaan Adeegnaa?",
        aboutServeDesc: "Waxaan ku takhasusnay casiirka miraha ee 100% dabiiciga ah, smoothie-yada labeenta leh, iyo Bunka Jebena ee dhaqanka ah. Sidoo kale waxaan bixinaa sambuuso iyo cuntooyin fudud oo caafimaad leh.",
        aboutStory: "Sheekadeena",
        aboutStoryDesc: "Nadi's waxay ku bilaabatay aragti sahlan: in Jigjiga laga helo cunto iyo cabitaan caafimaad leh oo dhadhan fiican leh. Waxaan mar walba isticmaalnaa miro cusub oo maxali ah.",
        contactUs: "Nagala Soo Xiriir",
        location: "Goobta",
        address: "Jigjiga, Itoobiya",
        phone: "Telefoon",
        whatsapp: "WhatsApp",
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
        heroSubtitle: "Fresh & Healthy",
        heroTitle: "Welcome to Nadi's Fresh Juice",
        menuTab: "Menu",
        aboutTab: "About Us",
        popularLabel: "Popular",
        noItems: "No items found in this category.",
        currency: "ETB",
        searchPlaceholder: "Search dishes, restaurants...",
        searchNoResults: "No results found for your search.",
        aboutWho: "Who is Nadi's?",
        aboutWhoDesc: "Nadi's Fresh Juice is a premium destination in Jigjiga for health-conscious foodies and lovers of natural drinks.",
        aboutServe: "What We Serve",
        aboutServeDesc: "We specialize in 100% natural fruit juices, creamy smoothies, and authentic Ethiopian Jebena coffee. We also offer delicious sambusas and healthy light snacks.",
        aboutStory: "Our Story",
        aboutStoryDesc: "Nadi's started with a simple vision: to make healthy living delicious and accessible in Jigjiga. We always use the freshest locally sourced fruits.",
        contactUs: "Contact Us",
        location: "Location",
        address: "Jigjiga, Ethiopia",
        phone: "Phone",
        whatsapp: "WhatsApp",
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
