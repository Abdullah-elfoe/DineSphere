const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".card");
    const prevBtn = document.querySelector(".btn-left");
    const nextBtn = document.querySelector(".btn-right");

    let index = 0;

    function cardsPerView() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3; // default desktop
    }

    function updateCarousel() {
      const visible = cardsPerView();
      const moveX = index * (100 / visible);
      track.style.transform = `translateX(-${moveX}%)`;
    }

    nextBtn.addEventListener("click", () => {
      const visible = cardsPerView();
      index = (index + 1) % (cards.length - visible + 1);
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      const visible = cardsPerView();
      index = (index - 1 + (cards.length - visible + 1)) % (cards.length - visible + 1);
      updateCarousel();
    });

    window.addEventListener("resize", updateCarousel);




// FAQs
document.addEventListener('DOMContentLoaded', () => {
            const accordionList = document.getElementById('faqAccordion');
            const items = accordionList.querySelectorAll('.accordion-item');

            // Function to handle the click/keyboard event
            function toggleAccordionItem(item) {
                const isActive = item.classList.contains('active');

                // Close all other open items
                items.forEach(i => {
                    if (i !== item) {
                        i.classList.remove('active');
                    }
                });

                // Toggle the clicked item
                if (!isActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }

            // 1. Setup Click Listeners for mouse/touch
            items.forEach(item => {
                const header = item.querySelector('.accordion-header');
                header.addEventListener('click', () => toggleAccordionItem(item));

                // 2. Setup Keydown Listeners for accessibility (Enter/Space)
                header.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault(); // Prevent default action (like scrolling on space)
                        toggleAccordionItem(item);
                    }
                });
            });


            /*
            * Search Automation Preparation (Placeholder for future JS library integration)
            * The core functionality of searching (filtering the list) is set up here.
            * Later, you can replace this manual filtering with a more advanced search library
            * that might also incorporate the Gemini API for smart content generation or grounding.
            */
            const searchInput = document.getElementById('faqSearchInput');
            
            // Debounce function to limit how often the filter function runs
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
                        // Show the item
                        item.style.display = 'block';
                    } else {
                        // Hide the item
                        item.style.display = 'none';
                    }
                });
            };

            // Apply the debounced filter function to the input event
            searchInput.addEventListener('input', debounce(filterFaqItems, 200));
        });