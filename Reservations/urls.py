from django.urls import path
from . import views


urlpatterns = [
    path("", views.home, name="home"),
    path("auth/", views.auth, name="auth"),
    path("logout/", views.home, name="logout"),
    path("Reservation/<slug:Restaurant_name>/", views.booking, name="Booking"),
    path("checkout/", views.home, name="Checkout"),
    path("Restaurant_Registration/", views.home, name="Restaurant_Registration"),


]