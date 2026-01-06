// document.addEventListener('DOMContentLoaded', function () {

//     updateRatings(); // Keep your existing rating logic

// //     // ---------------------- DATE PICKER ----------------------
// //     const dateBtn = document.getElementById('dateBtn');
// //     const dateContainer = document.getElementById('dateContainer');

// //     let selectedDate = null;

// //     // Calendar JSON stored in hidden element
// //     const calendarDataEl = document.getElementById('calendarData');
// //     const calendarData = calendarDataEl ? JSON.parse(calendarDataEl.textContent) : {};
// //     const slotDurationEl = document.getElementById('slotDuration');
// //     const slotDurationMinutes = slotDurationEl ? parseInt(slotDurationEl.dataset.minutes) : 60;

// //     if (dateBtn && typeof flatpickr !== 'undefined') {
// //         const fp = flatpickr(dateBtn, {
// //             minDate: 'today',
// //             maxDate: "today +60", // 60 days ahead
// //             dateFormat: "D, M j, Y",     
// //             onChange: function (selectedDates) {
// //                 selectedDate = selectedDates[0];
// //                 if (!selectedDate) return;

// //                 // Display "Today", "Tomorrow" or formatted date
// //                 const diff = Math.round((selectedDate - new Date()) / (1000 * 60 * 60 * 24));
// //                 if (diff === 0) dateBtn.textContent = 'Today';
// //                 else if (diff === 1) dateBtn.textContent = 'Tomorrow';
// //                 else dateBtn.textContent = selectedDate.toLocaleDateString('en-US', {
// //                     weekday: 'short', month: 'short', day: 'numeric'
// //                 });

// //                 populateStartTimes();
// //             }
// //         });

// //         if (dateContainer) dateContainer.addEventListener('click', () => fp.open());
// //     }

// //     // ---------------------- START & END HOUR ----------------------
// //     const startBtn = document.getElementById('startTimeBtn');
// //     const endBtn = document.getElementById('endTimeBtn');


// //     function parseTime(slotStr) {
// //     // Extract hour and minute manually, ignore date/timezone
// //     const timePart = slotStr.split('T')[1];        // '19:00:00.000Z' or '12:00:00'
// //     const [hourStr, minuteStr] = timePart.split(':'); 
// //     let hour = parseInt(hourStr);
// //     const minute = parseInt(minuteStr);
// //     const ampm = hour >= 12 ? 'PM' : 'AM';
// //     hour = hour % 12 || 12;
// //     return `${hour}:${minute.toString().padStart(2,'0')} ${ampm}`;
// // }

// // function populateStartTimes() {
// //     if (!selectedDate || !calendarData) return;

// //     const dateStr = selectedDate.toISOString().split('T')[0];
// //     const slots = calendarData[dateStr] || [];

// //     const startSelect = document.getElementById('startTimeBtn');
// //     const endSelect = document.getElementById('endTimeBtn');

// //     startSelect.innerHTML = '';
// //     endSelect.innerHTML = '';
// //     endSelect.disabled = true;

// //     if (slots.length === 0) {
// //         const option = document.createElement('option');
// //         option.textContent = 'No Slots';
// //         startSelect.appendChild(option);
// //         return;
// //     }

// //     // Populate start times
// //     slots.forEach(slotStr => {
// //         const option = document.createElement('option');
// //         option.value = slotStr;
// //         option.textContent = parseTime(slotStr);
// //         startSelect.appendChild(option);
// //     });

// //     startSelect.disabled = false;

// //     // When user selects a start time, populate end times
// //     startSelect.onchange = function() {
// //         const selectedStartStr = this.value;
// //         const startParts = selectedStartStr.split('T')[1].split(':');
// //         const selectedStartHour = parseInt(startParts[0]);
// //         const selectedStartMinute = parseInt(startParts[1]);

// //         endSelect.innerHTML = '';

// //         slots.forEach(slotStr => {
// //             const parts = slotStr.split('T')[1].split(':');
// //             const hour = parseInt(parts[0]);
// //             const minute = parseInt(parts[1]);

// //             // Only include slots after the selected start time
// //             if (hour > selectedStartHour || (hour === selectedStartHour && minute > selectedStartMinute)) {
// //                 const option = document.createElement('option');
// //                 option.value = slotStr;
// //                 option.textContent = parseTime(slotStr);
// //                 endSelect.appendChild(option);
// //             }
// //         });

// //         endSelect.disabled = false;
// //         endSelect.selectedIndex = 0;
// //     };

// //     // Trigger onchange for default selection
// //     startSelect.selectedIndex = 0;
// //     startSelect.onchange();
// // }





// //     function formatTime(dateObj) {
// //         const hours = dateObj.getHours();
// //         const minutes = dateObj.getMinutes();
// //         const ampm = hours >= 12 ? 'PM' : 'AM';
// //         const h = hours % 12 || 12;
// //         const m = minutes.toString().padStart(2, '0');
// //         return `${h}:${m} ${ampm}`;
// //     }

// //     // ---------------------- MIRROR TIME PICKER ----------------------
// //     const timeBtn = document.getElementById('timeBtn');
// //     const timeContainer = document.getElementById('timeContainer');

// //     if (timeBtn && timeContainer && typeof flatpickr !== 'undefined') {
// //         const tp = flatpickr(timeBtn, {
// //             enableTime: true,
// //             noCalendar: true,
// //             time_24hr: false,
// //             dateFormat: 'h:i K',
// //             defaultDate: new Date().setHours(20, 0, 0, 0),
// //             onChange: function (selectedDates) {
// //                 const selected = selectedDates[0];
// //                 if (!selected) return;
// //                 timeBtn.textContent = selected.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
// //             }
// //         });
// //         timeContainer.addEventListener('click', () => tp.open());
// //     }
// });


// function updateRatings() {
//     const ids = ["one", "two", "three", "four", "five"];
    
//     // 1. First, calculate the total count of all reviews
//     let totalReviews = 0;
//     ids.forEach(id => {
//         const el = document.getElementById(`${id}-star`);
//         totalReviews += Number(el.dataset.val) || 0;
//     });

//     // 2. Now update the widths based on the actual total
//     ids.forEach(id => {
//         const el = document.getElementById(`${id}-star`);
//         const val = Number(el.dataset.val) || 0;

//         // If there are no reviews at all, width is 0. 
//         // Otherwise, it's (this_category / total) * 100
//         const width = totalReviews > 0 ? (val / totalReviews) * 100 : 0;

//         el.style.width = width + "%";
//     });
// }
// console.log(document.getElementById("seatingsAllowed").dataset.seatingsallowed);
// const PARTY_VALUES = JSON.parse(document.getElementById("seatingsAllowed").dataset.seatingsallowed);
// const Price = JSON.parse(document.getElementById("seatingsAllowed").dataset.prices);
// let bookedSeats = 0;
// let PARTY_SIZE_MAX = 10;
// let PARTY_SIZE_MIN = 1;
// let partyIndex = 0;
// let partySize = 2; // Initial value

//         /**
//          * Updates the party size display based on the increment/decrement value.
//          * @param {number} delta - The change in party size (-1 or +1).
//          */
//         function updatePartySize(delta) {
//     const sizeInput = document.getElementById('party-size');
//     const price = document.getElementById("priceInfo");

//     let currentSize = parseInt(sizeInput.value, 10);
//     let newSize = currentSize + delta;

//     // Validate new size against min/max limits
//     if (newSize < PARTY_SIZE_MIN) newSize = PARTY_SIZE_MIN;
//     if (newSize > PARTY_VALUES[partyIndex]) newSize = PARTY_VALUES[partyIndex];

//     sizeInput.value = newSize-bookedSeats;

//     // Show/hide merge option based on updated value
//     document.getElementById('merge').style.display = (newSize === 1) ? 'none' : 'flex';

//     // Update price display
//     price.innerText = `$${Price[partyIndex] * newSize}`;
// }



        
//         const track = document.getElementById('testimonial-track');
//             const slides = Array.from(track.children);
//             const dotsContainer = document.getElementById('carousel-dots');
            
//             let currentSlide = 0;
//             const totalSlides = slides.length;
//             const slideInterval = 2700;

//             // 1. DYNAMICALLY SIZE THE TRACK
//             // Track width must be (Number of slides * 100%)
//             track.style.width = `${totalSlides * 100}%`;

//             // 2. DYNAMICALLY SIZE EACH SLIDE
//             // Each slide must be (100 / Total Slides)% of the Track
//             slides.forEach(slide => {
//                 slide.style.width = `${100 / totalSlides}%`;
//             });

//             // 3. GENERATE DOTS
//             slides.forEach((_, index) => {
//                 const dot = document.createElement('div');
//                 dot.classList.add('dot');
//                 if (index === 0) dot.classList.add('active');
//                 dot.addEventListener('click', () => goToSlide(index));
//                 dotsContainer.appendChild(dot);
//             });

//             const dots = document.querySelectorAll('.dot');

//             function updateDots() {
//                 dots.forEach((dot, index) => {
//                     dot.classList.toggle('active', index === currentSlide);
//                 });
//             }

//             function goToSlide(index) {
//                 currentSlide = index;
//                 // Move by calculating the percentage based on N slides
//                 const percentage = -(currentSlide * (100 / totalSlides));
//                 track.style.transform = `translateX(${percentage}%)`;
//                 updateDots();
//             }

//             function nextSlide() {
//                 currentSlide = (currentSlide + 1) % totalSlides;
//                 goToSlide(currentSlide);
//             }

//             // Start Auto-play
//             let autoSlide = setInterval(nextSlide, slideInterval);

//             // Optional: Pause on hover
//             const container = document.querySelector('.div-testimonials');
//             container.addEventListener('mouseenter', () => clearInterval(autoSlide));
//             container.addEventListener('mouseleave', () => autoSlide = setInterval(nextSlide, slideInterval));
        

//         function changeIndex(index) {
//             let price = document.getElementById("priceInfo");
//             partyIndex = index;
//             document.getElementById("party-size").value = PARTY_SIZE_MIN;
//             price.innerText = `$${Price[index]}`;
            
//             // party-size
//             console.log(index, typeof index, PARTY_VALUES[partyIndex]);
//             console.log(price.innerText + " EF");
            
//         }
//         function placeOrder() {
//             const NAME = document.getElementById("r-name").innerHTML;
//             const BOOKED_DATE = document.getElementById("dateBtn").innerText;
//             const BOOKED_START_HOUR = document.getElementById("startTimeBtn").innerText;
//             const BOOKED_END_HOUR = document.getElementById("endTimeBtn").innerText;
//             const BOOKED_SEATTYPE = document.querySelector('input[name="seating"]:checked').value;
//             const BOOKED_SEATS = document.getElementById("party-size").value;
            
   
//             document.getElementById("bookedName").value = NAME;
//             document.getElementById("form_date").value =
//                 document.getElementById("dateBtn").textContent.trim();

//             document.getElementById("form_start").value =
//                 document.getElementById("startTimeBtn").value;

//             document.getElementById("form_end").value =
//                 document.getElementById("endTimeBtn").value;

//             document.getElementById("form_party").value =
//                 document.getElementById("party-size").value;

//             const selectedSeating = document.querySelector("input[name='seating']:checked");
//             document.getElementById("form_seating").value = selectedSeating.value;

//             document.getElementById("form_price").value = document.getElementById("priceInfo").innerText;
//             // console.log(document.getElementById("form_price").value + " GGGGGG");
            

//             // Submit the hidden form
//             document.getElementById("reservationForm").submit();
// }

// Global variables for booking logic
let existingBookings = [];
const cooldownMinutes = 15;
let finalAvailableTables = 0; // The actual limit for the plus button

document.addEventListener('DOMContentLoaded', function () {
    updateRatings();
    
    // Initialize seating selection on load
    const selectedRadio = document.querySelector('input[name="seating"]:checked');
    if (selectedRadio) {
        updateSelectionDetails(selectedRadio);
    }

    // Carousel Logic
    initTestimonialCarousel();
});

// --- CORE BOOKING LOGIC ---

function getNormalizedMinutes(timeStr) {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = (h * 60) + m;
    if (h < 6) totalMinutes += 1440; // Midnight handling
    return totalMinutes;
}

function getMinutesFromISO(isoString) {
    if (!isoString) return null;
    const timePart = isoString.split('T')[1].substring(0, 5);
    return getNormalizedMinutes(timePart);
}

function fetchBookings(dateStr) {
    const rNameEl = document.getElementById('r-name');
    if (!rNameEl) return;
    const restaurantName = rNameEl.innerText.trim();
    const url = `/getThisBooking/${restaurantName}/${dateStr}/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            existingBookings = data;
            calculateLiveCapacity();
        })
        .catch(error => console.error('Error fetching bookings:', error));
}
function calculateLiveCapacity() {
    const startVal = document.getElementById('startTimeBtn').value;
    const endVal = document.getElementById('endTimeBtn').value;
    const selectedSeating = document.querySelector('input[name="seating"]:checked');

    if (!startVal || !endVal || !selectedSeating) return;

    const userStart = getNormalizedMinutes(startVal);
    const userEnd = getNormalizedMinutes(endVal);
    const seatingTypeName = selectedSeating.value;
    
    const totalPhysicalTables = PARTY_VALUES[partyIndex]; 

    let bookedTablesCount = 0;

    existingBookings.forEach(booking => {
        if (booking.booking_seatingtype__name === seatingTypeName) {
            const bStart = getMinutesFromISO(booking.booking_start_dateTime);
            const bEndRaw = getMinutesFromISO(booking.booking_end_dateTime);
            const bEndWithCooldown = bEndRaw + cooldownMinutes;

            // Perfect Overlap Algorithm
            if (userStart < bEndWithCooldown && userEnd > bStart) {
                // FIXED: Add the actual number of tables/seats booked, not just '1'
                // Note: If your JSON key is booking_no_of_seats, use that here.
                const count = parseInt(booking.booking_no_of_seats) || 0;
                bookedTablesCount += count; 
            }
        }
    });

    // Update the global limit: 10 total - 8 booked = 2 available
    finalAvailableTables = totalPhysicalTables - bookedTablesCount;
    
    // Ensure it doesn't go below 0
    if (finalAvailableTables < 0) finalAvailableTables = 0;

    // Reset current selection if it exceeds new availability
    const sizeInput = document.getElementById('party-size');
    let currentVal = parseInt(sizeInput.value);
    
    if (currentVal > finalAvailableTables) {
        sizeInput.value = finalAvailableTables > 0 ? 1 : 0;
    }
    
    // Update the visual display to show remaining capacity
    // (This helps the user understand why the plus button stops)
    const capacityDisplay = document.getElementById('display-capacity');
    if (capacityDisplay) {
        capacityDisplay.innerText = finalAvailableTables;
    }
    
    // Disable/Enable the plus button
    const incrementBtn = document.getElementById('increment-btn');
    if (finalAvailableTables <= 0 || currentVal >= finalAvailableTables) {
        incrementBtn.style.opacity = "0.5";
        // We don't necessarily disable it here so updatePartySize can show the alert
    } else {
        incrementBtn.style.opacity = "1";
    }
}
// --- UI UPDATES ---

const PARTY_VALUES = JSON.parse(document.getElementById("seatingsAllowed").dataset.seatingsallowed);
const Price = JSON.parse(document.getElementById("seatingsAllowed").dataset.prices);
let partyIndex = 0;

function updateSelectionDetails(radioElement) {
    const allRadios = Array.from(document.getElementsByName('seating'));
    partyIndex = allRadios.indexOf(radioElement);

    const priceDisplay = document.getElementById("priceInfo");
    const seatsPerTableDisplay = document.getElementById('display-capacity');
    
    // "Seats per table" is static info from your radio attribute
    const seatsPerTable = radioElement.getAttribute('data-available-seats');
    seatsPerTableDisplay.innerText = seatsPerTable;

    // Reset party size to 1 when changing seating type
    document.getElementById("party-size").value = 1;
    priceDisplay.innerText = `$${Price[partyIndex]}`;
    
    // Update hidden form
    document.getElementById("form_seating").value = radioElement.value;
    document.getElementById("form_price").value = priceDisplay.innerText;

    // Trigger capacity check for the new seating type
    calculateLiveCapacity();
}

function updatePartySize(delta) {
    const sizeInput = document.getElementById('party-size');
    const priceDisplay = document.getElementById("priceInfo");

    let currentSize = parseInt(sizeInput.value, 10);
    let newSize = currentSize + delta;

    // VALIDATION: Min 1, Max = finalAvailableTables (Calculated from AJAX)
    if (newSize < 1) newSize = 1;
    if (newSize > finalAvailableTables) {
        alert("No more tables available for this time slot.");
        newSize = finalAvailableTables;
    }

    if (finalAvailableTables <= 0) newSize = 0;

    sizeInput.value = newSize;

    // Show/hide merge option
    const mergeEl = document.getElementById('merge');
    if (mergeEl) mergeEl.style.display = (newSize === 1) ? 'none' : 'flex';

    // Update price based on number of tables
    priceDisplay.innerText = `$${Price[partyIndex] * newSize}`;
}

// --- DATE & TIME HANDLERS ---

const startInput = document.getElementById('startTimeBtn');
const endInput = document.getElementById('endTimeBtn');

if (typeof flatpickr !== 'undefined') {
    flatpickr("#dateBtn", {
        enableTime: false,
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                const datePart = instance.formatDate(selectedDates[0], "Y-m-d");
                document.getElementById('dateBtn').innerText = datePart;
                document.getElementById('form_date').value = datePart;
                fetchBookings(datePart);
            }
        }
    });
}

function validateTimeSelection() {
    const startMins = getNormalizedMinutes(startInput.value);
    const endMins = getNormalizedMinutes(endInput.value);
    
    if (startMins && endMins) {
        if (endMins <= startMins) {
            alert("End time must be later than Start time.");
            endInput.value = "";
        }
    }
    
    calculateLiveCapacity();
}

startInput.addEventListener('change', validateTimeSelection);
endInput.addEventListener('change', validateTimeSelection);

// --- UTILITIES & EXTERNAL LIBS ---

function updateRatings() {
    const ids = ["one", "two", "three", "four", "five"];
    let totalReviews = 0;
    ids.forEach(id => {
        const el = document.getElementById(`${id}-star`);
        if (el) totalReviews += Number(el.dataset.val) || 0;
    });

    ids.forEach(id => {
        const el = document.getElementById(`${id}-star`);
        if (el) {
            const val = Number(el.dataset.val) || 0;
            const width = totalReviews > 0 ? (val / totalReviews) * 100 : 0;
            el.style.width = width + "%";
        }
    });
}

function initTestimonialCarousel() {
    const track = document.getElementById('testimonial-track');
    if (!track) return;
    const slides = Array.from(track.children);
    const dotsContainer = document.getElementById('carousel-dots');
    if (!dotsContainer) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    track.style.width = `${totalSlides * 100}%`;
    slides.forEach(slide => slide.style.width = `${100 / totalSlides}%`);

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    function updateCarousel() {
        const percentage = -(currentSlide * (100 / totalSlides));
        track.style.transform = `translateX(${percentage}%)`;
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    }

    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 2700);
}

function placeOrder() {
    const dateBtnText = document.getElementById('dateBtn').innerText;
    if (!startInput.value || !endInput.value || dateBtnText === "Select Date") {
        alert("Please complete the date and time selection.");
        return;
    }

    // Sync final values to hidden form
    document.getElementById("form_date").value = dateBtnText;
    document.getElementById("form_start").value = startInput.value;
    document.getElementById("form_end").value = endInput.value;
    document.getElementById("form_party").value = document.getElementById("party-size").value;
    document.getElementById("form_price").value = document.getElementById("priceInfo").innerText;
    
    const selectedSeating = document.querySelector("input[name='seating']:checked");
    if (selectedSeating) document.getElementById("form_seating").value = selectedSeating.value;

    document.getElementById("reservationForm").submit();
}