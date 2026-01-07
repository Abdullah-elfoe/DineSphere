from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'restaurants', views.RestaurantViewSet, basename='restaurants')
router.register(r'bookings', views.BookingViewSet, basename='bookings')
router.register(r'seating-types', views.SeatingTypeViewSet, basename='seating-types')
router.register(r'testimonials', views.TestimonialViewSet, basename='testimonials')


urlpatterns = [
    path("", views.home, name="home"),
    path("auth/", views.auth, name="auth"),
    path("Reservation/<slug:Restaurant_name>/", views.booking, name="Booking"),
    path("checkout/", views.checkout, name="Checkout"),
    path("Restaurant-registration/", views.registration, name="Restaurant_Registration"),
    path("signup/", views.signup_user, name="signup"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),
    path("placeOrder/", views.placeOrder, name="place"),
    path("settings/", views.settings, name="settings"),
    path("cancel-booking/<int:booking_id>/", views.cancelBooking, name="cancelBooking"),
    path("api/auth/<slug:action>", views.handleAuthAPI, name="handleAuthAPI"),
    path("getThisBooking/<str:name>/<str:date>/", views.getThisBooking, name="getThisBooking"),
    path("toggle-favourite/", views.toggle_favourite, name="toggle_favourite"),
    # ----------------- REST API routes -----------------
    path('api/', include(router.urls)),
]
