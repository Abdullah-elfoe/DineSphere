document.addEventListener('DOMContentLoaded', function () {
    updateRatings(); // Keep your existing rating logic

    // ---------------------- DATE PICKER ----------------------
    const dateBtn = document.getElementById('dateBtn');
    const dateContainer = document.getElementById('dateContainer');

    let selectedDate = null;

    // Calendar JSON stored in hidden element
    const calendarDataEl = document.getElementById('calendarData');
    const calendarData = calendarDataEl ? JSON.parse(calendarDataEl.textContent) : {};
    const slotDurationEl = document.getElementById('slotDuration');
    const slotDurationMinutes = slotDurationEl ? parseInt(slotDurationEl.dataset.minutes) : 60;

    if (dateBtn && typeof flatpickr !== 'undefined') {
        const fp = flatpickr(dateBtn, {
            minDate: 'today',
            maxDate: "today +60", // 60 days ahead
            dateFormat: "D, M j, Y",     
            onChange: function (selectedDates) {
                selectedDate = selectedDates[0];
                if (!selectedDate) return;

                // Display "Today", "Tomorrow" or formatted date
                const diff = Math.round((selectedDate - new Date()) / (1000 * 60 * 60 * 24));
                if (diff === 0) dateBtn.textContent = 'Today';
                else if (diff === 1) dateBtn.textContent = 'Tomorrow';
                else dateBtn.textContent = selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric'
                });

                populateStartTimes();
            }
        });

        if (dateContainer) dateContainer.addEventListener('click', () => fp.open());
    }

    // ---------------------- START & END HOUR ----------------------
    const startBtn = document.getElementById('startTimeBtn');
    const endBtn = document.getElementById('endTimeBtn');


    function parseTime(slotStr) {
    // Extract hour and minute manually, ignore date/timezone
    const timePart = slotStr.split('T')[1];        // '19:00:00.000Z' or '12:00:00'
    const [hourStr, minuteStr] = timePart.split(':'); 
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2,'0')} ${ampm}`;
}

function populateStartTimes() {
    if (!selectedDate || !calendarData) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const slots = calendarData[dateStr] || [];

    const startSelect = document.getElementById('startTimeBtn');
    const endSelect = document.getElementById('endTimeBtn');

    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    endSelect.disabled = true;

    if (slots.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No Slots';
        startSelect.appendChild(option);
        return;
    }

    // Populate start times
    slots.forEach(slotStr => {
        const option = document.createElement('option');
        option.value = slotStr;
        option.textContent = parseTime(slotStr);
        startSelect.appendChild(option);
    });

    startSelect.disabled = false;

    // When user selects a start time, populate end times
    startSelect.onchange = function() {
        const selectedStartStr = this.value;
        const startParts = selectedStartStr.split('T')[1].split(':');
        const selectedStartHour = parseInt(startParts[0]);
        const selectedStartMinute = parseInt(startParts[1]);

        endSelect.innerHTML = '';

        slots.forEach(slotStr => {
            const parts = slotStr.split('T')[1].split(':');
            const hour = parseInt(parts[0]);
            const minute = parseInt(parts[1]);

            // Only include slots after the selected start time
            if (hour > selectedStartHour || (hour === selectedStartHour && minute > selectedStartMinute)) {
                const option = document.createElement('option');
                option.value = slotStr;
                option.textContent = parseTime(slotStr);
                endSelect.appendChild(option);
            }
        });

        endSelect.disabled = false;
        endSelect.selectedIndex = 0;
    };

    // Trigger onchange for default selection
    startSelect.selectedIndex = 0;
    startSelect.onchange();
}





    function formatTime(dateObj) {
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h = hours % 12 || 12;
        const m = minutes.toString().padStart(2, '0');
        return `${h}:${m} ${ampm}`;
    }

    // ---------------------- MIRROR TIME PICKER ----------------------
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
});


function updateRatings() {
    const ids = ["one", "two", "three", "four", "five"];
    
    // 1. First, calculate the total count of all reviews
    let totalReviews = 0;
    ids.forEach(id => {
        const el = document.getElementById(`${id}-star`);
        totalReviews += Number(el.dataset.val) || 0;
    });

    // 2. Now update the widths based on the actual total
    ids.forEach(id => {
        const el = document.getElementById(`${id}-star`);
        const val = Number(el.dataset.val) || 0;

        // If there are no reviews at all, width is 0. 
        // Otherwise, it's (this_category / total) * 100
        const width = totalReviews > 0 ? (val / totalReviews) * 100 : 0;

        el.style.width = width + "%";
    });
}
console.log(document.getElementById("seatingsAllowed").dataset.seatingsallowed);
const PARTY_VALUES = JSON.parse(document.getElementById("seatingsAllowed").dataset.seatingsallowed);
const Price = JSON.parse(document.getElementById("seatingsAllowed").dataset.prices);
let PARTY_SIZE_MAX = 10;
let PARTY_SIZE_MIN = 1;
let partyIndex = 0;
let partySize = 2; // Initial value

        /**
         * Updates the party size display based on the increment/decrement value.
         * @param {number} delta - The change in party size (-1 or +1).
         */
        function updatePartySize(delta) {
            console.log(typeof PARTY_VALUES);
            
            const sizeInput = document.getElementById('party-size');
            const price = document.getElementById("priceInfo");
            let currentSize = parseInt(sizeInput.value);
            let newSize = currentSize + delta;

            // if (newSize >= PARTY_SIZE_MIN && newSize <= PARTY_SIZE_MAX) {
            if (newSize >= PARTY_SIZE_MIN && newSize <= PARTY_VALUES[partyIndex]) {
                partySize = newSize;
                sizeInput.value = newSize;
                price.innerText = `$${Price[partyIndex]*newSize}`;
                

            } else {
                // Instead of alert, we can visually indicate the limit
                console.warn(`Party size limit reached: Max ${PARTY_VALUES[partyIndex]}, Min ${PARTY_SIZE_MIN}`);
            }
        }


        
        const track = document.getElementById('testimonial-track');
            const slides = Array.from(track.children);
            const dotsContainer = document.getElementById('carousel-dots');
            
            let currentSlide = 0;
            const totalSlides = slides.length;
            const slideInterval = 2700;

            // 1. DYNAMICALLY SIZE THE TRACK
            // Track width must be (Number of slides * 100%)
            track.style.width = `${totalSlides * 100}%`;

            // 2. DYNAMICALLY SIZE EACH SLIDE
            // Each slide must be (100 / Total Slides)% of the Track
            slides.forEach(slide => {
                slide.style.width = `${100 / totalSlides}%`;
            });

            // 3. GENERATE DOTS
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });

            const dots = document.querySelectorAll('.dot');

            function updateDots() {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }

            function goToSlide(index) {
                currentSlide = index;
                // Move by calculating the percentage based on N slides
                const percentage = -(currentSlide * (100 / totalSlides));
                track.style.transform = `translateX(${percentage}%)`;
                updateDots();
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                goToSlide(currentSlide);
            }

            // Start Auto-play
            let autoSlide = setInterval(nextSlide, slideInterval);

            // Optional: Pause on hover
            const container = document.querySelector('.div-testimonials');
            container.addEventListener('mouseenter', () => clearInterval(autoSlide));
            container.addEventListener('mouseleave', () => autoSlide = setInterval(nextSlide, slideInterval));
        

        function changeIndex(index) {
            let price = document.getElementById("priceInfo");
            partyIndex = index;
            document.getElementById("party-size").value = PARTY_SIZE_MIN;
            price.innerText = `$${Price[index]}`;
            
            // party-size
            console.log(index, typeof index, PARTY_VALUES[partyIndex]);
            console.log(price.innerText + " EF");
            
        }
        function placeOrder() {
            const NAME = document.getElementById("r-name").innerHTML;
            const BOOKED_DATE = document.getElementById("dateBtn").innerText;
            const BOOKED_START_HOUR = document.getElementById("startTimeBtn").innerText;
            const BOOKED_END_HOUR = document.getElementById("endTimeBtn").innerText;
            const BOOKED_SEATTYPE = document.querySelector('input[name="seating"]:checked').value;
            const BOOKED_SEATS = document.getElementById("party-size").value;
            
   
            document.getElementById("bookedName").value = NAME;
            document.getElementById("form_date").value =
                document.getElementById("dateBtn").textContent.trim();

            document.getElementById("form_start").value =
                document.getElementById("startTimeBtn").value;

            document.getElementById("form_end").value =
                document.getElementById("endTimeBtn").value;

            document.getElementById("form_party").value =
                document.getElementById("party-size").value;

            const selectedSeating = document.querySelector("input[name='seating']:checked");
            document.getElementById("form_seating").value = selectedSeating.value;

            document.getElementById("form_price").value = document.getElementById("priceInfo").innerText;
            // console.log(document.getElementById("form_price").value + " GGGGGG");
            

            // Submit the hidden form
            document.getElementById("reservationForm").submit();
}

