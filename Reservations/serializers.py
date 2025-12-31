# serializers.py
from rest_framework import serializers
from .models import Booking
from .models import Restaurant

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'  # or list fields explicitly



class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'  # or list fields explicitly


# serializers.py

from rest_framework import serializers
from .models import (
    Restaurant,
    Booking,
    SeatingType,
    RestaurantSeating,
    Testimonials,
    ReviewSummary,
)

# ------------------------------
# SeatingType
# ------------------------------
class SeatingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatingType
        fields = ['id', 'name']


# ------------------------------
# RestaurantSeating
# ------------------------------
class RestaurantSeatingSerializer(serializers.ModelSerializer):
    seating_type = SeatingTypeSerializer(read_only=True)

    class Meta:
        model = RestaurantSeating
        fields = [
            'id',
            'restaurant',
            'seating_type',
            'total_seats',
            'available_seats',
            'price_per_seat',
        ]


# ------------------------------
# Testimonials
# ------------------------------
class TestimonialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonials
        fields = ['id', 'restaurant', 'text', 'creator_name']


# ------------------------------
# ReviewSummary
# ------------------------------
class ReviewSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewSummary
        fields = ['id', 'restaurant', 'five_star', 'four_star', 'three_star', 'two_star', 'one_star', 'avg_rat']


# ------------------------------
# Restaurant (list view)
# ------------------------------
class RestaurantSerializer(serializers.ModelSerializer):
    seating_types = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'title',
            'image',
            'has_top_offers',
            'default_opening_hour',
            'default_closing_hour',
            'seating_types',
        ]

    def get_seating_types(self, obj):
        # get all seating types via the through table
        return [
            {"id": rs.seating_type.id, "name": rs.seating_type.name}
            for rs in obj.restaurantseating_set.all()
        ]

# ------------------------------
# Restaurant detail view
# ------------------------------
class RestaurantDetailSerializer(serializers.ModelSerializer):
    seating_types = SeatingTypeSerializer(many=True, read_only=True)
    review_summary = ReviewSummarySerializer(read_only=True)
    testimonials = TestimonialsSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'title',
            'image',
            'about_restaurant',
            'has_top_offers',
            'default_opening_hour',
            'default_closing_hour',
            'slot_duration_minutes',
            'allow_advance_booking_days',
            'seating_types',
            'review_summary',
            'testimonials',
        ]


# ------------------------------
# Booking
# ------------------------------
class BookingSerializer(serializers.ModelSerializer):
    booking_seatingtype = SeatingTypeSerializer(read_only=True)
    restaurant = RestaurantSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'restaurant',
            'booking_start_dateTime',
            'booking_end_dateTime',
            'booking_seatingtype',
            'booking_no_of_seats',
        ]
