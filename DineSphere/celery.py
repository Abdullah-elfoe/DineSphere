from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

# Set default Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DineSphere.settings')

app = Celery('DineSphere')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Optional: periodic task schedule
app.conf.beat_schedule = {
    'update-bookings-every-5-minutes': {
        'task': 'Reservations.tasks.update_booking_statuses',
        'schedule': 1800.0,  # in seconds, e.g., 1800 sec = 30 minutes
    },
}
