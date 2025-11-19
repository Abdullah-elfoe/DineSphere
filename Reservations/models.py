from django.contrib.auth.models import AbstractUser
from django.db import models

class SeatingType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    available_seats = models.IntegerField()

    def __str__(self):
        return self.name

    review = models.TextField()
    
    
    
# Actual models ----------------------------------------------------------------------

class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    rating = models.IntegerField()
    avail_dates_n_times = models.JSONField(blank=True, null=True)
    seating_types = models.ManyToManyField(SeatingType, blank=True)
    about_restaurant = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    fb_link = models.URLField(blank=True, null=True)
    website_link = models.URLField(blank=True, null=True)
    has_top_offers = models.BooleanField(default=False)

    def get_date_n_times(self):
        ...
    
    def add_availability(self, date, times):
        ...

    
    def __str__(self):
        return self.name

class Testimonials(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    text = models.TextField(blank=True, default="Amazing food and cozy atmosphere! The staff were friendly and attentive. Highly recommend for a great dining experience.")
    creator_name = models.CharField(blank=True, default="Anonymous")



class ReviewSummary(models.Model):
    restaurant = models.OneToOneField(Restaurant, related_name="review_summary", on_delete=models.CASCADE)
    average_rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    total_reviews = models.PositiveIntegerField(default=0)
    five_star = models.PositiveIntegerField(default=0)
    four_star = models.PositiveIntegerField(default=0)
    three_star = models.PositiveIntegerField(default=0)
    two_star = models.PositiveIntegerField(default=0)
    one_star = models.PositiveIntegerField(default=0)

    def updateAverageRating(self):
        self.average_rating = (self.five_star + self.four_star + self.three_star + self.two_star + self.one_star)/5

    def __str__(self):
        return self.average_rating