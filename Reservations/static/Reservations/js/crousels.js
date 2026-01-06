/**
 * DineSphere Home Page Logic - Responsive Edition
 */

function toggleFavorite(event, restaurantId) {
    event.stopPropagation();
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');
    let favorites = JSON.parse(localStorage.getItem('dinesphere_favs')) || [];
    
    if (icon.classList.contains('fa-regular')) {
        icon.classList.replace('fa-regular', 'fa-solid');
        btn.classList.add('active');
        if (!favorites.includes(restaurantId)) favorites.push(restaurantId);
    } else {
        icon.classList.replace('fa-solid', 'fa-regular');
        btn.classList.remove('active');
        favorites = favorites.filter(id => id !== restaurantId);
    }
    localStorage.setItem('dinesphere_favs', JSON.stringify(favorites));
}

document.addEventListener('DOMContentLoaded', () => {
    // The "Inspect Element" Simulator
window.addEventListener('load', () => {
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 300); 
});
    const initCarousels = () => {
        const carousels = document.querySelectorAll('.carousel');
        
        carousels.forEach((carousel, i) => {
            const track = carousel.querySelector('.carousel-track');
            const cards = carousel.querySelectorAll('.modern-card');
            const prevBtn = carousel.querySelector('.btn-left');
            const nextBtn = carousel.querySelector('.btn-right');
            
            if (!track || cards.length === 0) return;

            let index = 0;
            const gap = 20; // Must match CSS gap

            const getVisibleCount = () => {
                const w = window.innerWidth;
                if (w <= 480) return 1;
                if (w <= 768) return 2;
                if (w <= 1024) return 3;
                return 5;
            };

            const updateCarousel = () => {
    // 1. Get current widths
    const containerWidth = track.parentElement.offsetWidth;
    const cardWidth = cards[0].offsetWidth;
    const gap = 20;

    // 2. Calculate how many cards are fully/mostly visible
    // We use floor to ensure we don't get stuck if a card is 1% visible
    const visibleCards = Math.floor(containerWidth / (cardWidth + gap));
    
    // 3. Fix: maxIndex should allow you to reach the very last item
    // If visibleCards is 1 (mobile), maxIndex is cards.length - 1
    const maxIndex = cards.length - Math.max(1, visibleCards);
    
    // 4. Boundary check
    if (index > maxIndex) index = maxIndex;
    if (index < 0) index = 0;

    // 5. Move the track
    const moveX = index * (cardWidth + gap);
    track.style.transform = `translateX(-${moveX}px)`;
    
    // 6. Fix Button Visibility
    if (prevBtn) {
        prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
        // Only hide if we are at the absolute limit
        nextBtn.style.visibility = index >= maxIndex ? 'hidden' : 'visible';
    }
};

            nextBtn?.addEventListener('click', () => {
                index++;
                updateCarousel();
            });

            prevBtn?.addEventListener('click', () => {
                index--;
                updateCarousel();
            });

            // Touch support for mobile swipe
            let startX, moveX;
            track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
            track.addEventListener('touchmove', e => moveX = e.touches[0].clientX);
            track.addEventListener('touchend', () => {
                if (startX - moveX > 50) index++; // swipe left
                if (startX - moveX < -50) index--; // swipe right
                updateCarousel();
            });

            window.addEventListener('resize', updateCarousel);
            // Wait for images to load or small delay to get correct offsetWidth
            setTimeout(updateCarousel, 100);
        });
    };

    const mainPage = document.getElementById('main-page');
    if (mainPage) {
        // Force recalculation of layout
        setTimeout(() => {
            mainPage.style.height = 'auto'; // Reset height
            mainPage.style.height = `${mainPage.scrollHeight}px`; // Force recalculation
        }, 100);
    }
 

    initCarousels();
    // syncFavoritesUI();
});