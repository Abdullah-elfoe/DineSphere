from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import User



# models.py

class SeatingType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='restaurant_images/', blank=True, null=True)
    seating_types = models.ManyToManyField(SeatingType, through='RestaurantSeating', blank=True)
    about_restaurant = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    fb_link = models.URLField(blank=True, null=True)
    website_link = models.URLField(blank=True, null=True)
    has_top_offers = models.BooleanField(default=False)

    default_opening_hour = models.IntegerField(default=18)  # 6 PM
    default_closing_hour = models.IntegerField(default=1)   # 1 AM
    slot_duration_minutes = models.IntegerField(default=60) # 1 hour default
    allow_advance_booking_days = models.IntegerField(default=60)

    def __str__(self):
        return self.name


class RestaurantSeating(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    seating_type = models.ForeignKey(SeatingType, on_delete=models.CASCADE)
    total_seats = models.IntegerField(default=10,)
    available_seats = models.IntegerField(default=0,)
    price_per_seat = models.IntegerField(default=430,)

    class Meta:
        unique_together = ('restaurant', 'seating_type')

    def __str__(self):
        return f"Restaurant:{self.restaurant} Seating:{self.seating_type} contains:{self.available_seats}/{self.total_seats}"



class SpecialDay(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    date = models.DateField()
    closed_full_day = models.BooleanField(default=False)
    adjusted_opening_hour = models.IntegerField(null=True, blank=True)
    adjusted_closing_hour = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.restaurant.name} - {self.date}"

class Booking(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    booking_start_dateTime = models.DateTimeField()
    booking_end_dateTime = models.DateTimeField()
    booking_seatingtype = models.ForeignKey(SeatingType, on_delete=models.SET_NULL, null=True)
    booking_no_of_seats = models.IntegerField()
    card_number = models.IntegerField()
    name_on_the_card = models.CharField(max_length=30)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.restaurant.name} - {self.booking_start_dateTime} to {self.booking_end_dateTime}"


class Testimonials(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    text = models.TextField(blank=True, default="Amazing food and cozy atmosphere! The staff were friendly and attentive. Highly recommend for a great dining experience.")
    creator_name = models.CharField(blank=True, default="Anonymous")

    def __str__(self):
        return f"{self.creator_name} says: {self.text[:40]} ..."


class ReviewSummary(models.Model):
    restaurant = models.OneToOneField(
        Restaurant,
        related_name="review_summary",
        on_delete=models.CASCADE
    )

    five_star = models.PositiveIntegerField(default=0)
    four_star = models.PositiveIntegerField(default=0)
    three_star = models.PositiveIntegerField(default=0)
    two_star = models.PositiveIntegerField(default=0)
    one_star = models.PositiveIntegerField(default=0)

    def total_reviews(self):
        return (
            self.five_star +
            self.four_star +
            self.three_star +
            self.two_star +
            self.one_star
        )

    def average_rating(self):
        total = self.total_reviews()
        if total == 0:
            return 0.0

        score = (
            self.five_star * 5 +
            self.four_star * 4 +
            self.three_star * 3 +
            self.two_star * 2 +
            self.one_star * 1
        )

        return round(score / total, 1)
    
    @property
    def avg_rat(self):
        return self.average_rating()
    
 

