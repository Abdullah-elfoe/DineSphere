from django.shortcuts import render




def home(request):
    return render(request, "Reservations/home.html")

def auth(request):
    return render(request, "Reservations/auth.html")

def logout(request):
    return render(request, "Reservations/home.html")


def booking(request, Restaurant_name):
    content = {'name': Restaurant_name}
    return render(request, "Reservations/booking.html", context=content)


def checkout(request):
    return render(request, "Reservations/checkout.html")


def restaurantReservation(request):
    return render(request, "Reservations/restaurantReservation.html")
