
document.addEventListener('DOMContentLoaded', () => {
    // Carousel logic for all carousels
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel, i) => {
        const track = carousel.querySelector('.carousel-track');
        const cards = carousel.querySelectorAll('.card');
        const prevBtn = carousel.querySelector('.btn-left');
        const nextBtn = carousel.querySelector('.btn-right');
        let index = 0;

        function cardsPerView() {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 768) return 2;
            if (window.innerWidth <= 1024) return 3;
            if (window.innerWidth <= 1400) return 4;
            if (window.innerWidth <= 1800) return 5;
            return 6;
        }

        function updateCarousel() {
            const visible = cardsPerView();
            // Clamp index so last page always shows visible cards
            if (index > cards.length - visible) index = 0;
            if (index < 0) index = cards.length - visible;
            // Calculate percent to move
            const moveX = (index * (100 / visible));
            track.style.transform = `translateX(-${moveX}%)`;
            // Show/hide buttons if needed (optional)
        }

        nextBtn.addEventListener('click', () => {
            const visible = cardsPerView();
            index = (index + 1) % (cards.length - visible + 1);
            updateCarousel();
        });
        prevBtn.addEventListener('click', () => {
            const visible = cardsPerView();
            index = (index - 1 + (cards.length - visible + 1)) % (cards.length - visible + 1);
            updateCarousel();
        });
        window.addEventListener('resize', updateCarousel);

        // Auto-slide with stagger
        setTimeout(() => {
            setInterval(() => {
                const visible = cardsPerView();
                index = (index + 1) % (cards.length - visible + 1);
                updateCarousel();
            }, 4000);
        }, i * 600); // stagger start by 0.6s per carousel

        updateCarousel();
    });

    // FAQs (unchanged)
    const accordionList = document.getElementById('faqAccordion');
    if (accordionList) {
        const items = accordionList.querySelectorAll('.accordion-item');
        function toggleAccordionItem(item) {
            const isActive = item.classList.contains('active');
            items.forEach(i => { if (i !== item) i.classList.remove('active'); });
            if (!isActive) item.classList.add('active'); else item.classList.remove('active');
        }
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => toggleAccordionItem(item));
            header.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleAccordionItem(item);
                }
            });
        });
        const searchInput = document.getElementById('faqSearchInput');
        let searchTimeout;
        const debounce = (func, delay = 300) => {
            return function(...args) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => func.apply(this, args), delay);
            };
        };
        const filterFaqItems = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            items.forEach(item => {
                const question = item.querySelector('.accordion-question').textContent.toLowerCase();
                const body = item.querySelector('.accordion-body-content').textContent.toLowerCase();
                const terms = item.getAttribute('data-search-terms') || "";
                const combinedText = `${question} ${body} ${terms}`;
                if (combinedText.includes(searchTerm) || searchTerm === "") {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };
        searchInput.addEventListener('input', debounce(filterFaqItems, 200));
    }
});