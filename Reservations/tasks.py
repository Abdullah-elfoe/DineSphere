from celery import shared_task
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Booking

@shared_task
def update_booking_statuses():
    now = timezone.now()
    pending_bookings = Booking.objects.filter(status=Booking.STATUS_PENDING)

    for booking in pending_bookings:
        booking_datetime = datetime.combine(booking.date, booking.time)
        booking_datetime = timezone.make_aware(booking_datetime)
        
        # Assume 1 hour duration + 15 min cooldown
        booking_duration = timedelta(hours=1)
        cooldown = timedelta(minutes=15)

        if now > booking_datetime + booking_duration + cooldown:
            booking.status = Booking.STATUS_FINISHED
            booking.save()
            print(f"Booking {booking.id} marked as finished")
