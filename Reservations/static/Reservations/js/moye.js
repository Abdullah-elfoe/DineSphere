const PARTY_SIZE_MAX = 10;
        const PARTY_SIZE_MIN = 1;
        let partySize = 2; // Initial value

        /**
         * Updates the party size display based on the increment/decrement value.
         * @param {number} delta - The change in party size (-1 or +1).
         */
        function updatePartySize(delta) {
            const sizeInput = document.getElementById('party-size');
            let currentSize = parseInt(sizeInput.value);
            let newSize = currentSize + delta;

            if (newSize >= PARTY_SIZE_MIN && newSize <= PARTY_SIZE_MAX) {
                partySize = newSize;
                sizeInput.value = newSize;
            } else {
                // Instead of alert, we can visually indicate the limit
                console.warn(`Party size limit reached: Max ${PARTY_SIZE_MAX}, Min ${PARTY_SIZE_MIN}`);
            }
        }
        
        let currentSlide = 0;
        const track = document.getElementById('testimonial-track');
        const slides = document.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;
        const slideInterval = 4000; // Increased interval to 4 seconds for better readability

        /**
         * Moves the carousel to the next slide.
         */
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            // The 33.33% is calculated as 100% divided by totalSlides (3)
            track.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
        }

        // Start the carousel auto-slide loop
        setInterval(nextSlide, slideInterval);