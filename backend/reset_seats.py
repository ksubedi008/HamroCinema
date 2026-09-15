import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from cinema.models import Seat, TheaterScreen, TicketItem

print("Deleting all TicketItems...")
TicketItem.objects.all().delete()

print("Deleting all Seats...")
Seat.objects.all().delete()

print("Regenerating seats for all screens...")
for screen in TheaterScreen.objects.all():
    for num in range(1, 11):
        for col in range(1, 3):
            seat_label = f"L{num}-{col}"
            Seat.objects.get_or_create(screen=screen, seat_label=seat_label, defaults={'tier': 'Silver'})
        for col in range(1, 7):
            if num > 2:
                seat_label = f"M{num}-{col}"
                Seat.objects.get_or_create(screen=screen, seat_label=seat_label, defaults={'tier': 'Gold'})
        for col in range(1, 3):
            seat_label = f"R{num}-{col}"
            Seat.objects.get_or_create(screen=screen, seat_label=seat_label, defaults={'tier': 'Silver'})

print(f"Total seats now: {Seat.objects.count()}")
