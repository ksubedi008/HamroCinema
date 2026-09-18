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
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    director = models.CharField(max_length=255, blank=True, null=True)
    cast = models.TextField(blank=True, null=True)
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
    SHIFT_CHOICES = (
        ('Morning', 'Morning'),
        ('Day', 'Day'),
        ('Night', 'Night'),
    )
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    screen = models.ForeignKey(TheaterScreen, on_delete=models.CASCADE, related_name='showtimes')
    date = models.DateField(null=True)
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.date or not self.shift:
            raise ValidationError("Date and shift are required.")
            
        overlapping = Showtime.objects.filter(screen=self.screen, date=self.date, shift=self.shift)
        if self.pk:
            overlapping = overlapping.exclude(pk=self.pk)
            
        if overlapping.exists():
            raise ValidationError(f"A {self.shift} showtime already exists for {self.screen.screen_name} on {self.date}.")

    def save(self, *args, **kwargs):
        from datetime import datetime, timedelta
        
        # Infer legacy data if missing
        if not self.date and self.start_time:
            self.date = self.start_time.date()
        if not self.shift and self.start_time:
            hour = self.start_time.hour
            if hour < 12:
                self.shift = 'Morning'
            elif hour < 17:
                self.shift = 'Day'
            else:
                self.shift = 'Night'
        
        time_str = '00:00:00'
        if self.shift == 'Morning':
            time_str = '09:00:00'
            self.price = 150
        elif self.shift == 'Day':
            time_str = '13:00:00'
            self.price = 250
        elif self.shift == 'Night':
            time_str = '18:00:00'
            self.price = 250
            
        if self.date and self.shift:
            dt_str = f"{self.date} {time_str}"
            self.start_time = datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
            
            if self.movie and self.movie.duration:
                self.end_time = self.start_time + timedelta(minutes=self.movie.duration)
                
        self.full_clean()
        super().save(*args, **kwargs)
        
        # Ensure U-Shaped grid exists for the screen (100 seats: L=20, M=60, R=20)
        # We'll use rows 1-10. Left: L1-L2, Middle: M1-M6, Right: R1-R2
        if self.screen.seats.count() < 100:
            for num in range(1, 11):
                # Left Block (2 columns)
                for col in range(1, 3):
                    seat_label = f"L{num}-{col}"
                    Seat.objects.get_or_create(screen=self.screen, seat_label=seat_label, defaults={'tier': 'Silver'})
                
                # Middle Block (6 columns)
                for col in range(1, 7):
                    # For a U-Shape cavity, omit the middle block for the first 2 rows (num 1 and 2)
                    if num > 2:
                        seat_label = f"M{num}-{col}"
                        Seat.objects.get_or_create(screen=self.screen, seat_label=seat_label, defaults={'tier': 'Gold'})
                
                # Right Block (2 columns)
                for col in range(1, 3):
                    seat_label = f"R{num}-{col}"
                    Seat.objects.get_or_create(screen=self.screen, seat_label=seat_label, defaults={'tier': 'Silver'})

    def __str__(self):
        if self.start_time:
            return f"{self.movie.title} - {self.screen.screen_name} ({self.start_time.strftime('%Y-%m-%d %H:%M')})"
        return f"{self.movie.title} - {self.screen.screen_name} ({self.date} {self.shift})"

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

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_resets')
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"OTP for {self.user.username} ({self.otp_code})"
