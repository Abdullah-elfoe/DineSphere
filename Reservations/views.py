from django.shortcuts import render, redirect
from .models import *
from json import dumps
from datetime import datetime, timedelta, time
from django.core.serializers.json import DjangoJSONEncoder


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
    return render(request, "Reservations/home.html", {
        "Restaurants": restaurants
    })

def auth(request):
    return render(request, "Reservations/auth.html")

def logout(request):
    return render(request, "Reservations/home.html")


def booking(request, Restaurant_name):
    restaurant_obj = Restaurant.objects.filter(name=Restaurant_name).first()
    seating_types = restaurant_obj.restaurantseating_set.select_related('seating_type').all()
    seating_numbers = [x.available_seats for x in seating_types]
    testimonials = Testimonials.objects.all()
    ratings = ReviewSummary.objects.filter(restaurant=restaurant_obj).first()
    restaurant, calendar = daily_calendar_view(restaurant_id=restaurant_obj.id)
    # print(type())

    context = {
        'Restaurant': restaurant_obj, 
        'Seating':seating_types,
        'testimonials':testimonials,
        'available_seats':dumps(seating_numbers),
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

    print(date, start_time, end_time, format_to_ampm(end_time), party_size, seating)
    context = {
    "name":name,
    "date": date,
    "start_time": format_to_ampm(start_time),
    "end_time": format_to_ampm(end_time),
    "party_size": party_size,
    "seating": seating,
}

    
    
    return render(request, "Reservations/checkout.html", context)


def restaurantReservation(request):
    return render(request, "Reservations/restaurantReservation.html")



from datetime import date as date_class

# Function to generate slots (already added, adapted for minutes)
def generate_daily_slots(restaurant, target_date):
    try:
        special = SpecialDay.objects.get(restaurant=restaurant, date=target_date)
    except SpecialDay.DoesNotExist:
        special = None

    if special and special.closed_full_day:
        return []

    opening = special.adjusted_opening_hour if special and special.adjusted_opening_hour is not None else restaurant.default_opening_hour
    closing = special.adjusted_closing_hour if special and special.adjusted_closing_hour is not None else restaurant.default_closing_hour

    slots = []
    current_datetime = datetime.combine(target_date, time(hour=opening))
    end_datetime = datetime.combine(target_date, time(hour=closing))
    if closing <= opening:
        end_datetime += timedelta(days=1)

    while current_datetime < end_datetime:
        slots.append(current_datetime)
        current_datetime += timedelta(minutes=restaurant.slot_duration_minutes)
    return slots

def filter_booked_slots(restaurant, target_date):
    daily_slots = generate_daily_slots(restaurant, target_date)
    booked_slots = Booking.objects.filter(
        restaurant=restaurant,
        booking_datetime__date=target_date
    ).values_list('booking_datetime', flat=True)
    available_slots = [slot for slot in daily_slots if slot not in booked_slots]
    return available_slots

# Main view to render calendar
def daily_calendar_view(restaurant_id):
    restaurant = Restaurant.objects.get(id=restaurant_id)
    today = date_class.today()
    
    # Generate slots for next 60 days
    calendar = {}
    for n in range(restaurant.allow_advance_booking_days + 1):
        target_date = today + timedelta(days=n)
        available_slots = filter_booked_slots(restaurant, target_date)
        calendar[target_date.isoformat()] = available_slots
    
    
    return restaurant, calendar
