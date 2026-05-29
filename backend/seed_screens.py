import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from cinema.models import TheaterScreen, Seat

print("Clearing old screens...")
TheaterScreen.objects.all().delete()
Seat.objects.all().delete()

print("Generating Theater Screens and Seats...")

# Screen 1
screen1 = TheaterScreen.objects.create(screen_name='Screen 1', total_capacity=100)
print(f"Created {screen1.screen_name}")
# 10 Rows (A-J), 10 Columns
for row in 'ABCDEFGHIJ':
    for col in range(1, 11):
        if row in 'ABC':
            tier = 'Silver' # Front seats (cheapest)
        elif row in 'DEFG':
            tier = 'Platinum' # Middle seats (most expensive)
        else:
            tier = 'Gold' # Back seats (standard)
        Seat.objects.create(screen=screen1, seat_label=f"{row}{col}", tier=tier)
print("  -> Generated 100 seats (Silver front, Platinum middle, Gold back)")

# Screen 2
screen2 = TheaterScreen.objects.create(screen_name='Screen 2', total_capacity=100)
print(f"Created {screen2.screen_name}")
# 10 Rows (A-J), 10 Columns
for row in 'ABCDEFGHIJ':
    for col in range(1, 11):
        if row in 'ABC':
            tier = 'Silver'
        elif row in 'DEFG':
            tier = 'Platinum'
        else:
            tier = 'Gold'
        Seat.objects.create(screen=screen2, seat_label=f"{row}{col}", tier=tier)
print("  -> Generated 100 seats (Silver front, Platinum middle, Gold back)")

print("Finished seeding database!")
