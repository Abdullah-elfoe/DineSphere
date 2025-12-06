from django.urls import path
from . import views


urlpatterns = [
    path("", views.home, name="home"),
    path("auth/", views.auth, name="auth"),
    path("Reservation/<slug:Restaurant_name>/", views.booking, name="Booking"),
    path("checkout/", views.checkout, name="Checkout"),
    path("Restaurant_Registration/", views.home, name="Restaurant_Registration"),
    path("signup/", views.signup_user, name="signup"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),
    path("placeOrder/", views.placeOrder, name="place"),
    path("<slug:_>/", views._404),
    path("<slug:_>/<slug:_2>/", views._404),
    path("<slug:_>/<slug:_2>/<slug:_3>/", views._404),
    path("<slug:_>/<slug:_2>/<slug:_3>/<slug:_4>/", views._404),
    path("<slug:_>/<slug:_2>/<slug:_3>/<slug:_4>/<slug:_5>/", views._404),




]