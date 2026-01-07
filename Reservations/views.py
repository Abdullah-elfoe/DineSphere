from django.shortcuts import render, redirect
from .models import *
from json import dumps
from datetime import datetime, timedelta, time
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .supporting import parse_date_time

from datetime import datetime


# For my flutter app integration -----------------------------------------------------------------------------------
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ReservationSerializer, RestaurantSerializer
from rest_framework import status ,filters
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token


from .serializers import (
    RestaurantSerializer,
    RestaurantDetailSerializer,
    BookingSerializer,
    SeatingTypeSerializer,
    RestaurantSeatingSerializer,
    TestimonialsSerializer,
    ReviewSummarySerializer,
)

# ------------------------------
# 1️⃣ Restaurants (list + filter)
# ------------------------------
class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.filter(is_approved=True)
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.AllowAny]

    # optional filters via query params
    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        has_top_offers = self.request.query_params.get("has_top_offers")
        if search:
            qs = qs.filter(name__icontains=search)
        if has_top_offers in ["true", "True", "1"]:
            qs = qs.filter(has_top_offers=True)
        return qs

    # 2️⃣ Restaurant detail (product page)
    def retrieve(self, request, pk=None):
        restaurant = get_object_or_404(Restaurant, pk=pk)
        serializer = RestaurantDetailSerializer(restaurant)
        return Response(serializer.data)

    # 5️⃣ Restaurant seating
    @action(detail=True, methods=["get"])
    def seating(self, request, pk=None):
        qs = RestaurantSeating.objects.filter(restaurant_id=pk)
        serializer = RestaurantSeatingSerializer(qs, many=True)
        return Response(serializer.data)

    # 6️⃣ Testimonials for a restaurant
    @action(detail=True, methods=["get"])
    def testimonials(self, request, pk=None):
        qs = Testimonials.objects.filter(restaurant_id=pk)
        serializer = TestimonialsSerializer(qs, many=True)
        return Response(serializer.data)

    # 7️⃣ Review summary for a restaurant
    @action(detail=True, methods=["get"])
    def review_summary(self, request, pk=None):
        try:
            summary = ReviewSummary.objects.get(restaurant_id=pk)
            serializer = ReviewSummarySerializer(summary)
            return Response(serializer.data)
        except ReviewSummary.DoesNotExist:
            return Response({"detail": "No review summary available."}, status=404)


# ------------------------------
# 3️⃣ Bookings (user-specific)
# ------------------------------
class BookingViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(customer=self.request.user)


# ------------------------------
# 4️⃣ Seating types
# ------------------------------
class SeatingTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SeatingType.objects.all()
    serializer_class = SeatingTypeSerializer
    permission_classes = [permissions.AllowAny]

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonials.objects.all()
    serializer_class = TestimonialsSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['restaurant__id']  # filter by restaurant ID

@api_view(['GET'])
def handleGetAPI(request, action):

    data = None
    status_code = status.HTTP_200_OK

    match action:
        case "Restaurants":
            qs = Restaurant.objects.filter(is_approved=True)
            data = RestaurantSerializer(qs, many=True).data

        case "Bookings":
            qs = Booking.objects.all()
            data = ReservationSerializer(qs, many=True).data

        case _:
            data = {
                "success": False,
                "error": "INVALID_ACTION",
                "message": f"Unknown action '{action}'"
            }
            status_code = status.HTTP_400_BAD_REQUEST

    return Response(data, status=status_code)

@api_view(['GET'])
def giveSpecificRestaurant(request, name):

    data = None
    status_code = status.HTTP_200_OK
    name = name.replace("-", " ").replace("_"," ")

    restaurant = Restaurant.objects.filter(
        name=name,
        is_approved=True
    ).first()

    if restaurant:
        data = RestaurantSerializer(restaurant).data
    else:
        data = {
            "success": False,
            "error": "RESTAURANT_NOT_FOUND",
            "message": f"Restaurant '{name}' not found or not approved"
        }
        status_code = status.HTTP_404_NOT_FOUND

    return Response(data, status=status_code)





@csrf_exempt  # OK for API if using tokens later
def handleAuthAPI(request, action):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": "Only POST allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"success": False, "message": "Invalid JSON"},
            status=400
        )

    # --------------------
    # LOGIN
    # --------------------
    print(action, "Yalili Yalila uswispiswisdigiamma")
    if action == "login":
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"success": False, "message": "Username and password required"},
                status=400
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return JsonResponse(
                {"success": False, "message": "Invalid credentials"},
                status=401
            )

        # 🔐 CREATE OR GET TOKEN
        token, created = Token.objects.get_or_create(user=user)

        return JsonResponse(
            {
                "success": True,
                "message": "Login successful",
                "token": token.key,  # 🔥 THIS IS THE IMPORTANT PART
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=200
        )

    # --------------------
    # REGISTER
    # --------------------
    elif action == "register":
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"success": False, "message": "Missing required fields"},
                status=400
            )

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"success": False, "message": "Username already exists"},
                status=409
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,  # Django hashes automatically
        )

        return JsonResponse(
            {
                "success": True,
                "message": "Account created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                },
            },
            status=201
        )

    # --------------------
    # UNKNOWN ACTION
    # --------------------
    return JsonResponse(
        {"success": False, "message": "Invalid action"},
        status=404
    )



# end For my flutter app integration --------------------------------------------------------------------------------

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
    restaurants = Restaurant.objects.filter(is_approved=True)
    three_users = UserProfile.objects.all()[:3]
    fav_res = []
    user_image = None
    
    if request.user.is_authenticated:
        
        user_favs = FavouriteRestaurant.objects.filter(user=request.user).values_list('restaurant_id', flat=True)
        # adding temporary is_favourite attribute to each restaurant
        restaurants = restaurants.annotate(
            is_favourite=models.Case(
                models.When(id__in=user_favs, then=models.Value(True)),
                default=models.Value(False),
                output_field=models.BooleanField()
            )
        )
        # Get only favorite restaurants for the favorites carousel
        favorite_restaurants = Restaurant.objects.filter(id__in=user_favs, is_approved=True).annotate(
            is_favourite=models.Value(True, output_field=models.BooleanField())
        )
        user_profile = UserProfile.objects.filter(user=request.user).first()
        if user_profile and user_profile.image:
            user_image = user_profile.image.url
    
    min_prices = []
    for restaurant in restaurants:
        seating_prices = [x.price_per_table for x in restaurant.restaurantseating_set.all()]
        min_price = min(seating_prices) if seating_prices else None
        min_prices.append(min_price)
    combined = list(zip(restaurants,  [ReviewSummary.objects.filter(restaurant=x).first() for x in restaurants], min_prices))
    favorite_min_prices = []
    for restaurant in favorite_restaurants:
        seating_prices = [x.price_per_table for x in restaurant.restaurantseating_set.all()]
        min_price = min(seating_prices) if seating_prices else None
        favorite_min_prices.append(min_price)
    favorite_combined = list(zip(favorite_restaurants, [ReviewSummary.objects.filter(restaurant=x).first() for x in favorite_restaurants], favorite_min_prices))
    
    return render(request, "Reservations/home.html", {
        "Restaurants": restaurants,
        "combined":combined,
        "user_image": user_image if request.user.is_authenticated else None,
        "favorite_combined": favorite_combined,
        "footer": True,
        "three_users": three_users 
    })

def auth(request):
    return render(request, "Reservations/auth.html")



def booking(request, Restaurant_name):
    Restaurant_name = Restaurant_name.replace("-", " ").replace("_"," ")
    restaurant_obj = Restaurant.objects.filter(name=Restaurant_name).first()
    bookings = Booking.objects.filter(restaurant=restaurant_obj, status=Booking.STATUS_PENDING)
    if not restaurant_obj.is_approved:
        return render(request, "Reservations/404.html", {
            "message_title": "Restaurant Not Approved",
            "message": """The restaurant you are trying to book is not approved yet. Please try again later."""
        })
    seating_types = restaurant_obj.restaurantseating_set.select_related('seating_type').all()
    seating_numbers = [x.available_tables for x in seating_types]
    prices = [x.price_per_table for x in seating_types]
    testimonials = Testimonials.objects.filter(restaurant=restaurant_obj)
    ratings = ReviewSummary.objects.filter(restaurant=restaurant_obj).first()
    restaurant, calendar = daily_calendar_view(restaurant_id=restaurant_obj.id)
    # print(type())

    context = {
        'Restaurant': restaurant_obj, 
        'Seating':seating_types,
        'testimonials':testimonials,
        'available_tables':dumps(seating_numbers),
        'prices':dumps(prices),
        'ratings':ratings,
        'restaurant':restaurant,
        'calendar':dumps(calendar, cls=DjangoJSONEncoder),
        'footer': True
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
    try:
        dt_obj = parse_date_time(date, start_time)
        print(f"Successfully created datetime: {dt_obj}")
    except Exception as e:
        print(f"Parsing Error: {e}")
    print(date, start_time, end_time)
    # print(date, start_time, end_time, format_to_ampm(end_time), party_size, seating)
    context = {
    "name":name,
    "date": date,
    "start_time": start_time,
    "end_time": end_time,
    "party_size": party_size,
    "seating": seating,
    "price":price,
    "footer": True
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
        dob = request.POST.get("dob")
        gender = request.POST.get("gender")
        image = request.FILES.get("image")

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
        user_profile = UserProfile.objects.create(
            user=user,
            date_of_birth=dob,
            gender=gender,
            image=image
        )
        user_profile.save()

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
        # try:
        #     # Create the full strings by injecting the current year
        #     start_datetime_str = f"{date_str} {current_year} {start_time_str}"
        #     end_datetime_str = f"{date_str} {current_year} {end_time_str}"
            
        #     # Convert the combined strings into datetime objects
        #     booking_start_datetime = datetime.strptime(start_datetime_str, DATETIME_FORMAT)
        #     booking_end_datetime = datetime.strptime(end_datetime_str, DATETIME_FORMAT)
        
        # except ValueError as e:
        #     # This catches genuine format issues if the UI sends something unexpected
        #     print(f"Datetime parsing error: {e}")
        #     return redirect("home") 



        # --- CREATE AND SAVE ORDER ---
        order = Booking(
            booking_start_dateTime=parse_date_time(date_str, start_time_str),
            booking_end_dateTime=parse_date_time(date_str, end_time_str),
            booking_seatingtype=seating,
            booking_no_of_seats=party_size,
            name_on_the_card=card_name,
            card_number=card_number,
            customer=user,
            restaurant=restaurant,
            seating_model=restaurant.restaurantseating_set.filter(seating_type=seating.pk, restaurant=restaurant.pk).first(),
            # price=30
        )
        order.save()
        print(order.booking_end_dateTime.date(), order.restaurant.name)
        # print(booking_start_datetime, booking_end_datetime)
        
        # 🚨 FIX 3: Critical - Must return the redirect result
        return redirect("home") 

    # Handle GET request
    return redirect("home")




def _404(request, _=None, _2=None, _3=None, _4=None, _5=None):
    return render(request, "Reservations/404.html", {
        "message_title":"Page Not Found",
        "message":"""Uh oh, we can't seem to find the page you're looking for. Try going back to the previous page or see our for more information"""
    })


def settings(request):
    if not request.user.is_authenticated:
        return redirect("login")

    user_profile = UserProfile.objects.filter(user=request.user).first()
    bookings = Booking.objects.filter(customer=request.user).order_by('-created_at')
    completed_booking = bookings.filter(status=Booking.STATUS_FINISHED)
    pending_booking = bookings.filter(status=Booking.STATUS_PENDING)
    canceled_booking = bookings.filter(status=Booking.STATUS_CANCELLED)
    return render(request, "Reservations/settings.html", {
        "user_profile": user_profile,
        "footer":False,
        "completed_booking": completed_booking if len(completed_booking) > 0 else None,
        "pending_booking": pending_booking if len(pending_booking) > 0 else None,
        "canceled_booking": canceled_booking if len(canceled_booking) > 0 else None,
    })


def cancelBooking(request, booking_id):
    if not request.user.is_authenticated:
        return redirect("login")

    booking = Booking.objects.filter(id=booking_id, customer=request.user).first()
    if booking.status == Booking.STATUS_PENDING:
        booking.status = Booking.STATUS_CANCELLED
        booking.save()
    return redirect("settings")


def registration(request):
    if request.method == "POST":
        name = request.POST.get("res_name")
        title = request.POST.get("res_title")
        image = request.FILES.get("res_image")
        about = request.POST.get("res_about")
        city = request.POST.get("city")
        cooldown = request.POST.get("cooldown")
        opening_hour = request.POST.get("open_hour")
        closing_hour = request.POST.get("close_hour")
        slot_duration = request.POST.get("slot_duration")
        advance_booking_days = request.POST.get("advance_days")
        fb_link = request.POST.get("fb_link")
        web_link = request.POST.get("web_link")
        seating_types = request.POST.getlist("seat_type[]")
        seating_prices = request.POST.getlist("seat_price[]")
        available_tables_list = request.POST.getlist("available_tables[]")

         # Validate input
        print(request.FILES.get("res_image"))
        print("{"*100)

        restaurant = Restaurant(
            name=name,
            title=title,
            image=image,
            about_restaurant=str(about),
            default_opening_hour=int(opening_hour),
            default_closing_hour=int(closing_hour),
            slot_duration_minutes=int(slot_duration),
            allow_advance_booking_days=int(advance_booking_days),
            fb_link=fb_link,
            website_link=web_link,
            city=city,
            cool_down=cooldown,
            is_approved=False  # New registrations are not approved by default
        )
        restaurant.save()
        
        ReviewSummary.objects.create(
            restaurant=restaurant
            )
        for seat_type_name, seat_price, available_tables in zip(seating_types, seating_prices, available_tables_list):
            seating_type = SeatingType.objects.filter(name=seat_type_name).first()
            if seating_type:
                restaurant_seating = RestaurantSeating(
                    restaurant=restaurant,
                    seating_type=seating_type,
                    total_tables=int(available_tables),
                    available_tables=int(available_tables),
                    price_per_table=int(seat_price)
                )
                restaurant_seating.save()

        messages.success(request, "Restaurant registered successfully! Awaiting approval.")
        return redirect("home")

    return render(request, "Reservations/registration.html", {
        "seatingtype": SeatingType.objects.all()
    })


def getThisBooking(request, name, date):
    name = name.replace("-", " ").replace("_"," ")
    # if request.method == "GET":
    #     return redirect("https://www.google.com/search?sca_esv=da380046654dbbf2&sxsrf=AE3TifOTm1cmeMjYOb6irYw19ak_swngRA:1767643903557&udm=2&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ1Y6MJ25_tmWITc7uy4KIeoJTKjrFjVxydQWqI2NcOhYPURIv2wPgv_w_sE_0Sc6QqqU7k8cSQndc5mTXCIWHa5yWh8UZLeaMB2TzsL707pc1UdUOyvWrdH9KzB0rwa56e4sZMK6yB9HCSc5sZ95qH7WhtZ4UgYYwhFKAtUJ9yDKl7bQ8&q=donkey&sa=X&ved=2ahUKEwi90tfXmvWRAxVj3AIHHb4DMccQtKgLegQIFBAB&biw=1600&bih=781&dpr=1")
    bookings = Booking.objects.filter(booking_start_dateTime__date=date, restaurant__name=name).values(
        'id','booking_start_dateTime', 'booking_end_dateTime', 'booking_no_of_seats', 'booking_seatingtype__name'
    )
    

    return JsonResponse(list(bookings), safe=False)
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from .models import FavouriteRestaurant, Restaurant

@login_required
@require_POST
def toggle_favourite(request):
    """
    Toggle favorite status of a restaurant.
    Expects POST request with 'restaurant_id' parameter.
    Returns JSON with success status and favorite state.
    """
    restaurant_id = request.POST.get('restaurant_id')
    try:
        restaurant = Restaurant.objects.get(id=restaurant_id)
    except Restaurant.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Restaurant not found'}, status=404)

    favourite, created = FavouriteRestaurant.objects.get_or_create(user=request.user, restaurant=restaurant)

    if not created:
        # If already exists, remove it
        favourite.delete()
        return JsonResponse({'success': True, 'favourited': False, 'restaurant_id': restaurant_id})

    return JsonResponse({'success': True, 'favourited': True, 'restaurant_id': restaurant_id})