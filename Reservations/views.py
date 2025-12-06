from django.shortcuts import render, redirect
from .models import *
from json import dumps
from datetime import datetime, timedelta, time
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required


from datetime import datetime

def format_to_ampm(dt_str):
    """Convert ISO datetime string to 'h:mm AM/PM', ignoring date and timezone completely"""
    if not dt_str:
        return ''
    
    # Extract hour and minute using slicing
    # Handles '2025-11-27T19:00:00' or '2025-11-27T19:00:00.000Z'
    time_part = dt_str.split('T')[1]  # '19:00:00.000Z'
    hour_minute = time_part.split(':')[:2]  # ['19', '00']
    hour = int(hour_minute[0])
    minute = int(hour_minute[1])

    # Create a naive datetime for formatting only
    dt_obj = datetime(2000, 1, 1, hour, minute)  # date arbitrary
    return dt_obj.strftime("%-I:%M %p")



def home(request):
    restaurants = Restaurant.objects.all()
    min_prices = []
    for restaurant in restaurants:
        seating_prices = [x.price_per_seat for x in restaurant.restaurantseating_set.all()]
        min_price = min(seating_prices) if seating_prices else None
        min_prices.append(min_price)
    combined = zip(restaurants,  [ReviewSummary.objects.filter(restaurant=x).first() for x in restaurants], min_prices)
    return render(request, "Reservations/home.html", {
        "Restaurants": restaurants,
        "combined":combined
    })

def auth(request):
    return render(request, "Reservations/auth.html")



def booking(request, Restaurant_name):
    Restaurant_name = Restaurant_name.replace("-", " ").replace("_"," ")
    restaurant_obj = Restaurant.objects.filter(name=Restaurant_name).first()
    seating_types = restaurant_obj.restaurantseating_set.select_related('seating_type').all()
    seating_numbers = [x.available_seats for x in seating_types]
    prices = [x.price_per_seat for x in seating_types]
    testimonials = Testimonials.objects.filter(restaurant=restaurant_obj)
    ratings = ReviewSummary.objects.filter(restaurant=restaurant_obj).first()
    restaurant, calendar = daily_calendar_view(restaurant_id=restaurant_obj.id)
    # print(type())

    context = {
        'Restaurant': restaurant_obj, 
        'Seating':seating_types,
        'testimonials':testimonials,
        'available_seats':dumps(seating_numbers),
        'prices':dumps(prices),
        'ratings':ratings,
        'restaurant':restaurant,
        'calendar':dumps(calendar, cls=DjangoJSONEncoder)
        }
    return render(request, "Reservations/booking.html", context=context)


def checkout(request):
    if request.method != "POST":
        return redirect("/")
    
    name = request.POST.get("name")
    date = request.POST.get("date")
    start_time = request.POST.get("start_time")
    end_time = request.POST.get("end_time")
    party_size = request.POST.get("party_size")
    seating = request.POST.get("seating")   # from radio button
    price = request.POST.get("price")
    # print(date, start_time, end_time, format_to_ampm(end_time), party_size, seating)
    context = {
    "name":name,
    "date": date,
    "start_time": format_to_ampm(start_time),
    "end_time": format_to_ampm(end_time),
    "party_size": party_size,
    "seating": seating,
    "price":price
}

    
    
    return render(request, "Reservations/checkout.html", context)


def restaurantReservation(request):
    return render(request, "Reservations/restaurantReservation.html")



from datetime import date as date_class

# Function to generate slots (already added, adapted for minutes)
def generate_daily_slots(restaurant, target_date):
    from django.utils import timezone
    try:
        special = SpecialDay.objects.get(restaurant=restaurant, date=target_date)
    except SpecialDay.DoesNotExist:
        special = None

    if special and special.closed_full_day:
        return []

    opening = special.adjusted_opening_hour if special and special.adjusted_opening_hour is not None else restaurant.default_opening_hour
    closing = special.adjusted_closing_hour if special and special.adjusted_closing_hour is not None else restaurant.default_closing_hour

    slots = []
# 💥 FIX 1: Make the start datetime TZ-aware
    naive_start = datetime.combine(target_date, time(hour=opening))
    current_datetime = timezone.make_aware(naive_start)
    
    # 💥 FIX 2: Make the end datetime TZ-aware
    naive_end = datetime.combine(target_date, time(hour=closing))
    end_datetime = timezone.make_aware(naive_end)

    # current_datetime = datetime.combine(target_date, time(hour=opening))
    # end_datetime = datetime.combine(target_date, time(hour=closing))
    if closing <= opening:
        end_datetime += timedelta(days=1)

    while current_datetime < end_datetime:
        slots.append(current_datetime)
        current_datetime += timedelta(minutes=restaurant.slot_duration_minutes)
    return slots

# The logic should be: a slot is unavailable if the time range it represents
# (from slot start to slot end) overlaps with any existing booking's time range.

def filter_booked_slots(restaurant, target_date):
    daily_slots = generate_daily_slots(restaurant, target_date)
    
    # 1. Fetch all existing bookings for the day with their start and end times
    # Note: We assume the Restaurant model still has slot_duration_minutes to calculate 
    # the end time for the *potential* slots, even if the saved bookings use the explicit end time.
    existing_bookings = Booking.objects.filter(
        restaurant=restaurant,
        booking_start_dateTime__date=target_date # Filter by date component of start time
    ).values('booking_start_dateTime', 'booking_end_dateTime', 'booking_no_of_seats')

    available_slots = []
    slot_duration = timedelta(minutes=restaurant.slot_duration_minutes)
    

    for slot_start in daily_slots:
        slot_end = slot_start + slot_duration
        is_booked = False
        
        # 2. Check for overlap against all existing bookings
        for booking in existing_bookings:
            # print(f"Checking Slot: {slot_start} to {slot_end}")
            # print(f"Against Booking: {booking['booking_start_dateTime']} to {booking['booking_end_dateTime']}")
            # Check for ANY overlap between the current slot's range 
            # (slot_start to slot_end) and the booking's range
            
            # Conflict if: (Slot starts before booking ends) AND (Slot ends after booking starts)
            if (slot_start < booking['booking_end_dateTime']) and \
               (slot_end > booking['booking_start_dateTime']):
                
                # IMPORTANT: If you track seats, you would check capacity here.
                # For simplicity, we just mark the entire slot as booked if *any* booking overlaps.
                is_booked = True
                break
        
        if not is_booked:
            available_slots.append(slot_start)
        
            
    return available_slots
# Main view to render calendar
def daily_calendar_view(restaurant_id):
    restaurant = Restaurant.objects.get(id=restaurant_id)
    today = date_class.today()
    calendar = {}

    # ...
    # This logic is fine, as it calls the (now updated) filter_booked_slots function
    for n in range(restaurant.allow_advance_booking_days + 1):
        target_date = today + timedelta(days=n)
        available_slots = filter_booked_slots(restaurant, target_date)
        calendar[target_date.isoformat()] = available_slots
    
    return restaurant, calendar



# -------------------------
# 1) SIGNUP USER
# -------------------------
def signup_user(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

        # Validate input
        if not username or not password or not email:
            messages.error(request, "All fields are required")
            return redirect("auth")  # your signup route

        # Check if username exists
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
            return redirect("auth")

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        messages.success(request, "Account created successfully! Please log in.")
        return redirect("login")  # your login route

    # If GET request, redirect to home or auth page
    return redirect("home")




# -------------------------
# 2) LOGIN USER
# -------------------------
def login_user(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        if request.user.is_authenticated:
             logout(request)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            print("I am here")
            return redirect("home")  
        else:
            messages.error(request, "Invalid username or password")
            

            return redirect("auth")

    return redirect("home")


def logout_user(request):
    if request.method != "POST":
        return auth(request)
    if request.user.is_authenticated:
        print(logout(request))
        print("Hello World"*10)
    else:
        print("Bello World -"*10)
 
    return redirect("home")

from datetime import datetime, date as date_class 
from django.shortcuts import redirect
# Remember to ensure all necessary imports (User, SeatingType, Booking) are present

def placeOrder(request):
    if request.method == "POST":
        # --- Retrieve Data ---
        username_str = request.POST.get("username")
        user = User.objects.filter(username=username_str).first()
        
        card_number = request.POST.get("cn")
        card_name = request.POST.get("card-name")
        start_time_str = request.POST.get("stime") # e.g., "9:00 pm"
        end_time_str = request.POST.get("etime")     # e.g., "10:00 pm"
        date_str = request.POST.get("date")             # e.g., "Sat, Nov 29"
        seating_name = request.POST.get("seating")
        seating = SeatingType.objects.filter(name=seating_name).first()
        party_size = int(request.POST.get("noOfseats"))
        restaurant_name = request.POST.get("rname")
        restaurant = Restaurant.objects.filter(name=restaurant_name).first()
        
        # 🚨 FIX 1: Check for missing time data immediately
        if not all([start_time_str, end_time_str, date_str]):
             # If any of the required fields are None/empty
             print("Error: Missing start_time, end_time, or date from form data.")
             return redirect("home") 

        # 🚨 FIX 2: Define the correct format string (injecting year)
        current_year = date_class.today().year 
        # %a, %b %d: Sat, Nov 29 | %Y: 2025 | %I:%M %p: 9:00 pm
        DATETIME_FORMAT = "%a, %b %d %Y %I:%M %p"

        # --- DATETIME CONVERSION CORE LOGIC ---
        try:
            # Create the full strings by injecting the current year
            start_datetime_str = f"{date_str} {current_year} {start_time_str}"
            end_datetime_str = f"{date_str} {current_year} {end_time_str}"
            
            # Convert the combined strings into datetime objects
            booking_start_datetime = datetime.strptime(start_datetime_str, DATETIME_FORMAT)
            booking_end_datetime = datetime.strptime(end_datetime_str, DATETIME_FORMAT)
        
        except ValueError as e:
            # This catches genuine format issues if the UI sends something unexpected
            print(f"Datetime parsing error: {e}")
            return redirect("home") 

        # --- CREATE AND SAVE ORDER ---
        order = Booking(
            booking_start_dateTime=booking_start_datetime,
            booking_end_dateTime=booking_end_datetime,
            booking_seatingtype=seating,
            booking_no_of_seats=party_size,
            name_on_the_card=card_name,
            card_number=int(card_number),
            customer=user,
            restaurant=restaurant
            # price=30
        )
        order.save()
        print(booking_start_datetime, booking_end_datetime)
        
        # 🚨 FIX 3: Critical - Must return the redirect result
        return redirect("home") 

    # Handle GET request
    return redirect("home")
