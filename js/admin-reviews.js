import { supabase } from './supabase.js';

console.log('--- ADMIN REVIEWS SCRIPT LOADED ---');

/**
 * Render all reviews in the admin panel
 */
export async function renderAdminReviews() {
    const list = document.getElementById('reviews-list-admin');
    const avgLabel = document.getElementById('avg-rating');
    
    if (!list) return;

    try {
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log(`Fetched ${reviews.length} reviews`);

        const avg = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : '0.0';
        
        if (avgLabel) avgLabel.textContent = avg;

        if (reviews.length === 0) {
            list.innerHTML = `<tr><td colspan="5" class="px-8 py-10 text-center text-gray-400 italic">No reviews found.</td></tr>`;
            return;
        }

        list.innerHTML = reviews.map(review => `
            <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-5">
                    <div class="flex gap-0.5 text-secondary">
                        ${Array(5).fill(0).map((_, i) => `
                            <svg class="w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                            </svg>
                        `).join('')}
                    </div>
                </td>
                <td class="px-8 py-5">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-gray-900">${review.name || 'Anonymous'}</span>
                        <p class="text-[11px] text-gray-500 max-w-xs truncate" title="${review.feedback || 'No comment'}">
                            ${review.feedback || 'No comment'}
                        </p>
                    </div>
                </td>
                <td class="px-8 py-5">
                    <span class="text-xs text-gray-400 font-medium">${new Date(review.created_at).toLocaleDateString()}</span>
                </td>
                <td class="px-8 py-5">
                    <div class="flex items-center gap-3">
                        <button class="review-delete-btn p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all" 
                                data-id="${review.id}" title="Delete">
                            <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Render error:', err);
    }
}

// Global Event Listener
document.addEventListener('click', async (e) => {
    // Delete
    const deleteBtn = e.target.closest('.review-delete-btn');
    if (deleteBtn) {
        e.preventDefault();
        const id = deleteBtn.dataset.id;
        console.log('Delete clicked', id);
        
        if (confirm('Permanently delete this review?')) {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .delete()
                    .eq('id', id)
                    .select();

                if (error) throw error;

                if (!data || data.length === 0) {
                    console.warn('Delete successful but 0 rows affected. Check Supabase RLS policies.');
                    alert('Permission Denied: You might need to add an RLS policy in Supabase for "authenticated" users to DELETE from the reviews table.');
                } else {
                    console.log('Delete successful');
                    await renderAdminReviews();
                }
            } catch (err) {
                alert('Error: ' + err.message);
            }
        }
        return;
    }
});

// Initial load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAdminReviews);
} else {
    renderAdminReviews();
}

window.renderAdminReviews = renderAdminReviews;
