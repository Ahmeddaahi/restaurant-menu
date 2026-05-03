import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    const reviewsListAdmin = document.getElementById('reviews-list-admin');
    const avgRatingLabel = document.getElementById('avg-rating');

    // Initialize
    renderAdminReviews();

    // Export function to window so it can be called from sidebar
    window.renderAdminReviews = renderAdminReviews;

    async function renderAdminReviews() {
        try {
            const { data: reviews, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            // Calculate average rating
            const avg = reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : '0.0';
            avgRatingLabel.textContent = avg;

            if (reviews.length === 0) {
                reviewsListAdmin.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-8 py-10 text-center text-gray-400 italic">No reviews found in Supabase.</td>
                    </tr>
                `;
                return;
            }

            reviewsListAdmin.innerHTML = reviews.map(review => `
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
                                ${review.feedback || '<span class="text-gray-300 italic">No comment</span>'}
                            </p>
                        </div>
                    </td>
                    <td class="px-8 py-5">
                        <span class="text-xs text-gray-400 font-medium">${new Date(review.created_at).toLocaleDateString()}</span>
                    </td>
                    <td class="px-8 py-5">
                        <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${review.hidden ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}">
                            ${review.hidden ? 'Hidden' : 'Public'}
                        </span>
                    </td>
                    <td class="px-8 py-5">
                        <div class="flex items-center gap-3">
                            <button onclick="toggleReviewVisibility('${review.id}', ${review.hidden})" class="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary transition-all" title="${review.hidden ? 'Show' : 'Hide'}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${review.hidden ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18'}"></path>
                                </svg>
                            </button>
                            <button onclick="deleteReview('${review.id}')" class="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all" title="Delete">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Error rendering admin reviews:', err);
        }
    }

    window.toggleReviewVisibility = async function(id, currentHidden) {
        try {
            const { error } = await supabase
                .from('reviews')
                .update({ hidden: !currentHidden })
                .eq('id', id);

            if (error) throw error;
            await renderAdminReviews();
        } catch (err) {
            console.error('Error toggling visibility:', err);
            alert('Could not update visibility.');
        }
    };

    window.deleteReview = async function(id) {
        if (confirm('Are you sure you want to delete this review?')) {
            try {
                const { error } = await supabase
                    .from('reviews')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                await renderAdminReviews();
            } catch (err) {
                console.error('Error deleting review:', err);
                alert('Could not delete review.');
            }
        }
    };
});
