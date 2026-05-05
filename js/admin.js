/**
 * Jua Café - Admin Logic (Supabase Integration)
 */

import { supabase } from './supabase.js';

// --- Cloudflare R2i Configuration ---
const CF_WORKER_URL = 'https://r2-uploader.ahmedexga.workers.dev'; // Replace with your Worker URL
const CF_AUTH_SECRET = 'NadiFood123!'; // Replace with your AUTH_SECRET from Worker settings

// Cache key — must match the one in script.js
const MENU_CACHE_KEY = 'nadicafe_menu_v1';

/** Invalidate the public menu's localStorage cache after any admin change */
function bustMenuCache() {
    try { localStorage.removeItem(MENU_CACHE_KEY); } catch (_) {}
}

// Application State
const state = {
    menuData: [],
    categories: [],
    session: null
};

// --- Initialization ---
async function init() {
    // Check active session
    const { data: { session } } = await supabase.auth.getSession();
    state.session = session;

    if (session) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        await fetchData();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    // Listen for auth changes — store subscription for clean-up
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        state.session = session;
        if (!session) {
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('dashboard').classList.add('hidden');
        }
    });

    window.addEventListener('beforeunload', () => {
        authListener.subscription.unsubscribe();
    });

    // --- Image Upload UI Feedback ---
    const imageFileInput = document.getElementById('image-file');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                updateImageUploadUI(true, file.name);
            } else {
                updateImageUploadUI(false);
            }
        });
    }
}

function updateImageUploadUI(isSelected, fileName = '') {
    const defaultIcon = document.getElementById('default-upload-icon');
    const confirmedIcon = document.getElementById('confirmed-upload-icon');
    const uploadText = document.getElementById('upload-text');
    const container = document.getElementById('image-upload-container');

    if (isSelected) {
        defaultIcon.classList.add('hidden');
        confirmedIcon.classList.remove('hidden');
        uploadText.textContent = 'Image Ready';
        uploadText.classList.replace('text-gray-600', 'text-green-600');
        container.classList.replace('border-gray-100', 'border-green-100');
        container.classList.add('bg-green-50/30');
    } else {
        defaultIcon.classList.remove('hidden');
        confirmedIcon.classList.add('hidden');
        uploadText.textContent = 'Upload Image';
        uploadText.classList.replace('text-green-600', 'text-gray-600');
        container.classList.replace('border-green-100', 'border-gray-100');
        container.classList.remove('bg-green-50/30');
    }
}

async function fetchData() {
    // Fetch categories — only the columns we use
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name_en, name_so')
        .order('name_en');

    if (catError) console.error('Error fetching categories:', catError);
    state.categories = categories || [];

    // Fetch menu items — only the columns we use
    const { data: items, error: itemError } = await supabase
        .from('menu_items')
        .select('id, name_en, name_so, category_id, price, image_url, description_en, description_so, is_popular, rating, prep_time, created_at')
        .order('created_at', { ascending: false });

    if (itemError) console.error('Error fetching items:', itemError);

    state.menuData = (items || []).map(item => ({
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

    renderDashboard();
}

function renderDashboard() {
    renderItemList();
    renderCategorySelect();
    renderCategoryListAdmin();
    updateStats();
}

function updateStats() {
    document.getElementById('total-items').textContent = state.menuData.length;
    document.getElementById('total-categories').textContent = state.categories.length;
}

// --- Authentication ---
window.handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorEl = document.getElementById('login-error');

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    } else {
        errorEl.classList.add('hidden');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        await fetchData();
    }
};

window.handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
};

// --- UI Rendering ---
function renderCategorySelect() {
    const select = document.getElementById('category');
    select.innerHTML = state.categories
        .map(c => `<option value="${c.id}">${c.name_en}</option>`)
        .join('');
}

function renderCategoryListAdmin() {
    const list = document.getElementById('category-list-admin');
    list.innerHTML = state.categories.map(c => `
        <div class="flex items-center justify-between p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow group">
            <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold text-[10px] sm:text-xs uppercase shrink-0">
                    ${c.id.substring(0, 2)}
                </div>
                <div class="min-w-0">
                    <div class="font-bold text-gray-900 text-xs sm:text-sm truncate">${c.name_en}</div>
                    <div class="text-[9px] sm:text-[10px] text-gray-400 font-medium truncate">${c.name_so}</div>
                </div>
            </div>
            <button onclick="handleDeleteCategory('${c.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all lg:opacity-0 lg:group-hover:opacity-100 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `).join('');
}

window.renderItemList = (items = state.menuData) => {
    const list = document.getElementById('item-list');
    list.innerHTML = items.map(item => `
        <tr class="group hover:bg-gray-50/80 transition-colors">
            <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                    <div class="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-black/5">
                        <img src="${item.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div>
                        <div class="font-bold text-gray-900 text-sm tracking-tight">${item.name.en}</div>
                        <div class="text-[11px] text-gray-400 font-medium">${item.name.so}</div>
                    </div>
                </div>
            </td>
            <td class="px-8 py-5">
                <span class="inline-flex items-center px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
                    ${item.category}
                </span>
            </td>
            <td class="px-8 py-5">
                <div class="font-extrabold text-gray-900 text-sm">ETB ${item.price}</div>
                <div class="text-[9px] text-gray-400 mt-0.5">Base Price</div>
            </td>
            <td class="px-8 py-5">
                <div class="flex gap-2">
                    <button onclick="editItem('${item.id}')" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onclick="deleteItem('${item.id}')" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
};

window.filterAdminItems = () => {
    const q = document.getElementById('admin-search').value.toLowerCase();
    const filtered = state.menuData.filter(item =>
        item.name.en.toLowerCase().includes(q) ||
        item.name.so.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
    renderItemList(filtered);
};

// --- CRUD Operations ---
window.openModal = (id = null) => {
    const modal = document.getElementById('item-modal');
    const form = document.getElementById('item-form');
    const title = document.getElementById('modal-title');

    form.reset();
    document.getElementById('edit-id').value = id || '';

    if (id) {
        const item = state.menuData.find(i => i.id === id);
        title.textContent = 'Edit Item';
        document.getElementById('name-en').value = item.name.en;
        document.getElementById('name-so').value = item.name.so;
        document.getElementById('price').value = item.price;
        document.getElementById('category').value = item.category;
        document.getElementById('image-url').value = item.image;
        document.getElementById('prep-time').value = item.prepTime;
        document.getElementById('rating').value = item.rating;
        document.getElementById('desc-en').value = item.description.en;
        document.getElementById('desc-so').value = item.description.so;
    } else {
        title.textContent = 'Add New Item';
    }

    // Reset Image Upload UI
    updateImageUploadUI(false);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeModal = () => {
    const modal = document.getElementById('item-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

window.handleSaveItem = async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const id = document.getElementById('edit-id').value;
    const imageFile = document.getElementById('image-file').files[0];
    let imageUrl = document.getElementById('image-url').value;

    try {
        // Handle Image Upload (Cloudflare R2)
        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;

            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('filename', fileName);

            const response = await fetch(CF_WORKER_URL, {
                method: 'POST',
                headers: {
                    'X-Auth-Token': CF_AUTH_SECRET
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText}`);
            }

            const uploadData = await response.json();
            imageUrl = uploadData.url;
        }

        const itemData = {
            name_en: document.getElementById('name-en').value,
            name_so: document.getElementById('name-so').value,
            category_id: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            image_url: imageUrl,
            prep_time: document.getElementById('prep-time').value,
            rating: parseFloat(document.getElementById('rating').value),
            description_en: document.getElementById('desc-en').value,
            description_so: document.getElementById('desc-so').value
        };

        if (id) {
            // UPDATE: patch local state optimistically, no full re-fetch
            const { error } = await supabase
                .from('menu_items')
                .update(itemData)
                .eq('id', id);
            if (error) throw error;

            const idx = state.menuData.findIndex(i => String(i.id) === String(id));
            if (idx > -1) {
                state.menuData[idx] = {
                    ...state.menuData[idx],
                    name: { en: itemData.name_en, so: itemData.name_so },
                    category: itemData.category_id,
                    price: itemData.price,
                    image: itemData.image_url,
                    description: { en: itemData.description_en, so: itemData.description_so },
                    rating: itemData.rating,
                    prepTime: itemData.prep_time
                };
            }
            bustMenuCache(); // Invalidate public menu cache
            closeModal();
            renderDashboard();
        } else {
            // INSERT: must re-fetch to get the server-assigned ID
            const { error } = await supabase
                .from('menu_items')
                .insert([itemData]);
            if (error) throw error;
            bustMenuCache(); // Invalidate public menu cache
            closeModal();
            await fetchData();
        }
    } catch (err) {
        alert('Error saving item: ' + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
    }
};

window.deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting item: ' + error.message);
        } else {
            // Optimistic: remove from local state, no full re-fetch needed
            state.menuData = state.menuData.filter(i => String(i.id) !== String(id));
            bustMenuCache(); // Invalidate public menu cache
            renderDashboard();
        }
    }
};

window.editItem = (id) => {
    openModal(id);
};

// --- Category Management ---
window.openCategoryModal = () => {
    document.getElementById('category-modal').classList.remove('hidden');
    document.getElementById('category-modal').classList.add('flex');
};

window.closeCategoryModal = () => {
    document.getElementById('category-modal').classList.add('hidden');
    document.getElementById('category-modal').classList.remove('flex');
};

window.handleAddCategory = async (e) => {
    e.preventDefault();
    const id = document.getElementById('new-cat-id').value.trim();
    const name_en = document.getElementById('new-cat-en').value.trim();
    const name_so = document.getElementById('new-cat-so').value.trim();

    const { error } = await supabase
        .from('categories')
        .insert([{ id, name_en, name_so }]);

    if (error) {
        alert('Error adding category: ' + error.message);
    } else {
        document.getElementById('new-cat-id').value = '';
        document.getElementById('new-cat-en').value = '';
        document.getElementById('new-cat-so').value = '';
        // Optimistic: push to local state, no full re-fetch needed
        state.categories.push({ id, name_en, name_so });
        bustMenuCache(); // Invalidate public menu cache
        renderDashboard();
    }
};

window.handleDeleteCategory = async (id) => {
    if (confirm('Are you sure? This may affect items in this category.')) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting category: ' + error.message);
        } else {
            // Optimistic: remove from local state, no full re-fetch needed
            state.categories = state.categories.filter(c => c.id !== id);
            bustMenuCache(); // Invalidate public menu cache
            renderDashboard();
        }
    }
};

// --- Mobile Navigation ---
window.toggleMobileMenu = () => {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    const isOpen = !sidebar.classList.contains('-translate-x-full');

    if (isOpen) {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    } else {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    }
};

// Start initialization
document.addEventListener('DOMContentLoaded', init);
