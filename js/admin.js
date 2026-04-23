/**
 * Jua Café - Admin Logic
 */

import { menuItems, categories } from './data.js';

// Application State
const state = {
    menuData: JSON.parse(localStorage.getItem('customMenuItems')) || [...menuItems],
    categories: [...categories]
};

// --- Authentication ---
window.checkLogin = () => {
    const pass = document.getElementById('admin-password').value;
    if (pass === 'admin123') { // Simple default password
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        initDashboard();
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
};

window.logout = () => {
    location.reload();
};

// --- Dashboard Logic ---
function initDashboard() {
    renderItemList();
    renderCategorySelect();
    updateStats();
}

function updateStats() {
    document.getElementById('total-items').textContent = state.menuData.length;
    document.getElementById('total-categories').textContent = state.categories.length - 1; // Exclude 'All'
}

function renderCategorySelect() {
    const select = document.getElementById('category');
    select.innerHTML = state.categories
        .filter(c => c.id !== 'All')
        .map(c => `<option value="${c.id}">${c.en}</option>`)
        .join('');
}

window.renderItemList = (items = state.menuData) => {
    const list = document.getElementById('item-list');
    list.innerHTML = items.map(item => `
        <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" class="w-10 h-10 rounded-lg object-cover bg-gray-100">
                    <div>
                        <div class="font-bold text-gray-900 text-sm">${item.name.en}</div>
                        <div class="text-[10px] text-gray-400">${item.name.so}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase">${item.category}</span>
            </td>
            <td class="px-6 py-4 font-bold text-sm text-gray-900">$${item.price}</td>
            <td class="px-6 py-4">
                <div class="flex gap-2">
                    <button onclick="editItem(${item.id})" class="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onclick="deleteItem(${item.id})" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        item.name.so.toLowerCase().includes(q)
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
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeModal = () => {
    const modal = document.getElementById('item-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

window.saveItem = (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    
    const itemData = {
        id: id ? parseInt(id) : Date.now(),
        name: {
            en: document.getElementById('name-en').value,
            so: document.getElementById('name-so').value
        },
        category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        image: document.getElementById('image-url').value,
        prepTime: document.getElementById('prep-time').value,
        rating: parseFloat(document.getElementById('rating').value),
        description: {
            en: document.getElementById('desc-en').value,
            so: document.getElementById('desc-so').value
        },
        isPopular: false
    };

    if (id) {
        const index = state.menuData.findIndex(i => i.id === parseInt(id));
        state.menuData[index] = itemData;
    } else {
        state.menuData.push(itemData);
    }

    localStorage.setItem('customMenuItems', JSON.stringify(state.menuData));
    closeModal();
    initDashboard();
};

window.deleteItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        state.menuData = state.menuData.filter(i => i.id !== id);
        localStorage.setItem('customMenuItems', JSON.stringify(state.menuData));
        initDashboard();
    }
};

window.editItem = (id) => {
    openModal(id);
};
