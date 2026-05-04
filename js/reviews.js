import { supabase } from './supabase.js';

export async function initReviewLogic(translations) {
    const reviewsList = document.getElementById('reviews-list');
    const avgRatingLarge = document.getElementById('avg-rating-large');
    const avgStarsSummary = document.getElementById('avg-stars-summary');
    const totalReviewsCount = document.getElementById('total-reviews-count');
    const reviewForm = document.getElementById('review-form');
    const reviewModal = document.getElementById('review-modal');
    const submissionTrigger = document.getElementById('submission-trigger');
    const successState = document.getElementById('success-state');
    const feedbackText = document.getElementById('feedback-text');
    const reviewerName = document.getElementById('reviewer-name');
    const charCounter = document.getElementById('char-counter');
    const submitBtn = document.getElementById('submit-btn');
    const formStars = document.getElementById('form-stars');
    const ratingLabel = document.getElementById('rating-label');

    if (!reviewsList) return;

    let currentRating = 0;
    const ratingTexts = {
        0: translations.selectRating,
        1: translations.needsImprovement,
        2: translations.fair,
        3: translations.good,
        4: translations.veryGood,
        5: translations.excellent
    };

    // Initialize UI
    await loadReviews();

    // Star distribution bars
    function updateBars(reviews) {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => {
            if (counts[r.rating] !== undefined) counts[r.rating]++;
        });
        
        const total = reviews.length || 1;
        for (let i = 1; i <= 5; i++) {
            const percentage = (counts[i] / total) * 100;
            const bar = document.getElementById(`bar-${i}`);
            if (bar) bar.style.width = `${percentage}%`;
        }
    }

    const openReviewForm = function(val = 0) {
        submissionTrigger.classList.add('hidden');
        reviewModal.classList.remove('hidden');
        successState.classList.add('hidden');
        
        // Initialize form stars
        formStars.innerHTML = Array(5).fill(0).map((_, i) => `
            <button type="button" class="star-btn p-1" data-value="${i + 1}">
                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
            </button>
        `).join('');

        const stars = formStars.querySelectorAll('.star-btn');
        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const v = parseInt(star.dataset.value);
                highlightStars(v, true);
                ratingLabel.textContent = ratingTexts[v];
            });

            star.addEventListener('mouseleave', () => {
                highlightStars(currentRating);
                ratingLabel.textContent = ratingTexts[currentRating];
            });

            star.addEventListener('click', () => {
                currentRating = parseInt(star.dataset.value);
                highlightStars(currentRating);
                ratingLabel.textContent = ratingTexts[currentRating];
                ratingLabel.classList.add('text-secondary');
            });
        });

        if (val > 0) {
            currentRating = val;
            highlightStars(val);
            ratingLabel.textContent = ratingTexts[val];
        }
    };

    const closeReviewForm = function() {
        reviewModal.classList.add('hidden');
        submissionTrigger.classList.remove('hidden');
        currentRating = 0;
    };

    function highlightStars(val, isHover = false) {
        const stars = formStars.querySelectorAll('.star-btn');
        stars.forEach(s => {
            const starVal = parseInt(s.dataset.value);
            s.classList.remove('active', 'hover', 'text-secondary');
            s.classList.add('text-gray-200');
            if (starVal <= val) {
                s.classList.remove('text-gray-200');
                s.classList.add(isHover ? 'hover' : 'active', 'text-secondary');
            }
        });
    }

    // Bind triggers
    const starTriggers = document.querySelectorAll('.star-btn-trigger');
    starTriggers.forEach(btn => {
        btn.onclick = () => openReviewForm(parseInt(btn.dataset.value));
    });

    const writeTextBtn = document.getElementById('write-review-text-btn');
    if (writeTextBtn) writeTextBtn.onclick = () => openReviewForm(5);

    const closeModalBtn = document.getElementById('close-review-modal');
    if (closeModalBtn) closeModalBtn.onclick = closeReviewForm;

    const writeAnotherBtn = document.getElementById('write-another-btn');
    if (writeAnotherBtn) writeAnotherBtn.onclick = () => {
        reviewForm.reset();
        currentRating = 0;
        charCounter.textContent = '0/500';
        successState.classList.add('hidden');
        submissionTrigger.classList.remove('hidden');
    };

    // Character Counter
    feedbackText.addEventListener('input', () => {
        charCounter.textContent = `${feedbackText.value.length}/500`;
    });

    // Form Submission
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (currentRating === 0) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const { error } = await supabase
                .from('reviews')
                .insert([{
                    rating: currentRating,
                    feedback: feedbackText.value,
                    name: reviewerName.value,
                    hidden: false
                }]);

            if (error) throw error;

            reviewModal.classList.add('hidden');
            successState.classList.remove('hidden');
            await loadReviews();
        } catch (err) {
            console.error('Submission error:', err);
            alert('Could not submit review. Please try again.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    async function loadReviews() {
        try {
            const { data: reviews, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            const visibleReviews = reviews.filter(r => !r.hidden);
            
            // Update Stats
            const avg = reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : '0.0';
            
            avgRatingLarge.textContent = avg;
            totalReviewsCount.textContent = `${visibleReviews.length} ${translations.reviewsCount}`;
            
            // Update summary stars
            avgStarsSummary.innerHTML = Array(5).fill(0).map((_, i) => `
                <svg class="w-3 h-3 ${i < Math.round(avg) ? 'text-secondary' : 'text-gray-200'}" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                </svg>
            `).join('');

            updateBars(reviews);

            if (visibleReviews.length === 0) {
                reviewsList.innerHTML = `<p class="text-center text-gray-400 italic py-10">${translations.noReviews}</p>`;
                return;
            }

            reviewsList.innerHTML = visibleReviews.map(review => `
                <div class="space-y-4 animate-slide-up">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full avatar-circle text-[clamp(0.875rem,3vw,1rem)]">
                            ${review.name ? review.name.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-gray-900">${review.name || 'Guest User'}</h4>
                            <div class="flex flex-col mt-0.5">
                                <div class="flex items-center gap-2">
                                    <div class="flex gap-0.5 text-secondary">
                                        ${Array(5).fill(0).map((_, i) => `
                                            <svg class="w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                                            </svg>
                                        `).join('')}
                                    </div>
                                    <span class="text-[10px] text-gray-400 font-medium">${timeAgo(review.created_at)}</span>
                                </div>
                                <div class="text-[9px] font-black text-secondary uppercase tracking-widest mt-1">
                                    Rated ${review.rating} ${translations.ratedOutOf}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed pl-14">
                        ${review.feedback || `<span class="italic text-gray-300">${translations.noReviews}</span>`}
                    </p>
                </div>
            `).join('');
        } catch (err) {
            console.error('Error loading reviews:', err);
        }
    }

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    }
}

