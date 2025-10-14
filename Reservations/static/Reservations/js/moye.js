document.addEventListener('DOMContentLoaded', function () {
    /* ---------------------- DATE PICKER ---------------------- */
    const dateBtn = document.getElementById('dateBtn');
    const datePicker = document.getElementById('datePicker');

    const fp = flatpickr(dateBtn, {
        minDate: "today",
        onChange: function (selectedDates) {
            const selectedDate = selectedDates[0];
            const today = new Date();

            if (!selectedDate) return;

            const diff = Math.round((selectedDate - today) / (1000 * 60 * 60 * 24));
            if (diff === -1) {
                dateBtn.textContent = "Today";
            } else if (diff === 0) {
                dateBtn.textContent = "Tomorrow";
            } else {
                dateBtn.textContent = selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                });
            }
        }
    });

    document.getElementById('dateContainer').addEventListener('click', () => fp.open());


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

    /* ---------------------- PARTY SIZE ---------------------- */
    const PARTY_SIZE_MAX = 10;
    const PARTY_SIZE_MIN = 1;
    let partySize = 2;

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

    /* ---------------------- TESTIMONIAL CAROUSEL ---------------------- */
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const totalTestimonialSlides = testimonialSlides.length;
    const testimonialSlideInterval = 4000;
    let testimonialCurrent = 0;

    function nextTestimonialSlide() {
        testimonialCurrent = (testimonialCurrent + 1) % totalTestimonialSlides;
        testimonialTrack.style.transform = `translateX(-${testimonialCurrent * (100 / totalTestimonialSlides)}%)`;
    }

    setInterval(nextTestimonialSlide, testimonialSlideInterval);
});