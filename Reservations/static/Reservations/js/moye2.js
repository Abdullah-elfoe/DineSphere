document.addEventListener('DOMContentLoaded', function () {
    /* ---------------------- DATE PICKER ---------------------- */
    const dateBtn = document.getElementById('dateBtn');
    const dateContainer = document.getElementById('dateContainer');

    let fp = null;
    if (dateBtn && typeof flatpickr !== 'undefined') {
        fp = flatpickr(dateBtn, {
            minDate: 'today',
            onChange: function (selectedDates) {
                const selectedDate = selectedDates[0];
                const today = new Date();
                if (!selectedDate) return;

                const diff = Math.round((selectedDate - today) / (1000 * 60 * 60 * 24));
                if (diff === 0) {
                    dateBtn.textContent = 'Today';
                } else if (diff === 1) {
                    dateBtn.textContent = 'Tomorrow';
                } else {
                    dateBtn.textContent = selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long', month: 'long', day: 'numeric'
                    });
                }
            }
        });
    }
    if (dateContainer && fp) {
        dateContainer.addEventListener('click', () => fp.open());
    }

    /* ---------------------- TIME PICKER (mirror date behavior) ---------------------- */
    const timeBtn = document.getElementById('timeBtn');
    const timeContainer = document.getElementById('timeContainer');
    if (timeBtn && timeContainer && typeof flatpickr !== 'undefined') {
        const tp = flatpickr(timeBtn, {
            enableTime: true,
            noCalendar: true,
            time_24hr: false,
            dateFormat: 'h:i K',
            defaultDate: new Date().setHours(20, 0, 0, 0),
            onChange: function (selectedDates) {
                const selected = selectedDates[0];
                if (!selected) return;
                timeBtn.textContent = selected.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            }
        });
        timeContainer.addEventListener('click', () => tp.open());
    }

    /* ---------------------- IMAGE SLIDER ---------------------- */
    const mainSlides = document.getElementsByClassName('slides');
    const dotsContainer = document.getElementById('dotsContainer');

    for (let i = 0; i < mainSlides.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => setMainSlide(i));
        if (dotsContainer) dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer ? dotsContainer.getElementsByClassName('dot') : [];
    let mainSlideIndex = 0;
    let mainAutoSlideInterval = null;

    function showMainSlide(n) {
        for (let i = 0; i < mainSlides.length; i++) {
            mainSlides[i].classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active-dot');
        }
        mainSlideIndex = (n + mainSlides.length) % mainSlides.length;
        mainSlides[mainSlideIndex].classList.add('active');
        if (dots[mainSlideIndex]) dots[mainSlideIndex].classList.add('active-dot');
    }

    window.changeSlide = function (n) {
        showMainSlide(mainSlideIndex + n);
        resetMainAutoSlide();
    };
    window.setMainSlide = function (n) {
        showMainSlide(n);
        resetMainAutoSlide();
    };

    function autoMainSlide() {
        showMainSlide(mainSlideIndex + 1);
    }
    function resetMainAutoSlide() {
        clearInterval(mainAutoSlideInterval);
        mainAutoSlideInterval = setInterval(autoMainSlide, 4000);
    }

    if (mainSlides.length) {
        showMainSlide(mainSlideIndex);
        mainAutoSlideInterval = setInterval(autoMainSlide, 4000);
    }

    // --------------------------------------------------
    const PARTY_SIZE_MAX = 10;
    const PARTY_SIZE_MIN = 1;
    let partySize = 2; // Initial value

    window.updatePartySize = function (delta) {
        const sizeInput = document.getElementById('party-size');
        let currentSize = parseInt(sizeInput.value);
        let newSize = currentSize + delta;

        if (newSize >= PARTY_SIZE_MIN && newSize <= PARTY_SIZE_MAX) {
            partySize = newSize;
            sizeInput.value = newSize;
        } else {
            console.warn(`Party size limit reached: Max ${PARTY_SIZE_MAX}, Min ${PARTY_SIZE_MIN}`);
        }
    };

    // Testimonial carousel
    let currentSlide = 0;
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    const slideInterval = 4000; // 4 seconds

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        if (track) track.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
    }

    if (totalSlides > 0) setInterval(nextSlide, slideInterval);
});


    /* ---------------------- IMAGE SLIDER ---------------------- */
    const mainSlides = document.getElementsByClassName('slides');
    const dotsContainer = document.getElementById('dotsContainer');

    for (let i = 0; i < mainSlides.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => setMainSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.getElementsByClassName('dot');
    let mainSlideIndex = 0;
    let mainAutoSlideInterval = null;

    function showMainSlide(n) {
        for (let i = 0; i < mainSlides.length; i++) {
            mainSlides[i].classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active-dot');
        }
        mainSlideIndex = (n + mainSlides.length) % mainSlides.length;
        mainSlides[mainSlideIndex].classList.add('active');
        if (dots[mainSlideIndex]) dots[mainSlideIndex].classList.add('active-dot');
    }

    window.changeSlide = function (n) {
        showMainSlide(mainSlideIndex + n);
        resetMainAutoSlide();
    };
    window.setMainSlide = function (n) {
        showMainSlide(n);
        resetMainAutoSlide();
    };

    function autoMainSlide() {
        showMainSlide(mainSlideIndex + 1);
    }
    function resetMainAutoSlide() {
        clearInterval(mainAutoSlideInterval);
        mainAutoSlideInterval = setInterval(autoMainSlide, 4000);
    }

    showMainSlide(mainSlideIndex);
    mainAutoSlideInterval = setInterval(autoMainSlide, 4000);


// --------------------------------------------------
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