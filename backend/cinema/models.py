from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
        ('Customer', 'Customer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Customer')
    loyalty_points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    duration = models.IntegerField(help_text="Duration in minutes")
    genre = models.CharField(max_length=100, blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    poster = models.ImageField(upload_to='posters/', blank=True, null=True)
    status = models.CharField(
        max_length=20, 
        choices=[('Now Showing', 'Now Showing'), ('Coming Soon', 'Coming Soon')], 
        default='Now Showing'
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class TheaterScreen(models.Model):
    screen_name = models.CharField(max_length=100)
    total_capacity = models.IntegerField(default=75)

    def __str__(self):
        return self.screen_name

class Showtime(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    screen = models.ForeignKey(TheaterScreen, on_delete=models.CASCADE, related_name='showtimes')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.movie.title} - {self.screen.screen_name} ({self.start_time.strftime('%Y-%m-%d %H:%M')})"

class Seat(models.Model):
    TIER_CHOICES = (
        ('Gold', 'Gold'),
        ('Silver', 'Silver'),
        ('Platinum', 'Platinum'),
    )
    screen = models.ForeignKey(TheaterScreen, on_delete=models.CASCADE, related_name='seats')
    seat_label = models.CharField(max_length=10) # e.g. A1, G4
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='Gold')

    class Meta:
        unique_together = ('screen', 'seat_label')

    def __str__(self):
        return f"{self.screen.screen_name} - {self.seat_label} ({self.tier})"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE, related_name='bookings')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    esewa_ref_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.user.username}"

class TicketItem(models.Model):
    LOCK_STATUS_CHOICES = (
        ('Available', 'Available'),
        ('Locked', 'Locked'),
        ('Booked', 'Booked'),
    )
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='tickets', null=True, blank=True)
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE, related_name='tickets')
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    lock_status = models.CharField(max_length=20, choices=LOCK_STATUS_CHOICES, default='Available')
    lock_timestamp = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('showtime', 'seat')

    def __str__(self):
        return f"{self.showtime} - {self.seat.seat_label} ({self.lock_status})"
