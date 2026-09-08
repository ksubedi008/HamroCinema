from datetime import timedelta
from django.db.models import Q
from rest_framework import serializers
from .models import User, Movie, TheaterScreen, Showtime, Seat, Booking, TicketItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'date_joined', 'is_active', 'loyalty_points']

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class TheaterScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = TheaterScreen
        fields = '__all__'

class ShowtimeSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    screen_name = serializers.CharField(source='screen.screen_name', read_only=True)
    # The admin shouldn't have to manually calculate this. We will auto-calculate it.
    end_time = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Showtime
        fields = '__all__'

    def validate(self, data):
        movie = data.get('movie')
        screen = data.get('screen')
        start_time = data.get('start_time')

        # If partial update missing these fields, skip validation
        if not movie or not screen or not start_time:
            return data

        # 1. Calculate end_time including the movie's duration AND a 30-minute turnaround buffer
        # The 30 extra minutes account for cleaning the theater and playing trailers for the next show.
        total_blocked_minutes = movie.duration + 30
        end_time = start_time + timedelta(minutes=total_blocked_minutes)
        data['end_time'] = end_time

        # 2. Check for overlaps on the same screen within this newly buffered window
        # Formula for overlap: (Existing Start < New End) AND (Existing End > New Start)
        overlapping_shows = Showtime.objects.filter(
            screen=screen,
            start_time__lt=end_time,
            end_time__gt=start_time
        )

        # If we are updating an existing showtime, don't count itself as a collision
        if self.instance:
            overlapping_shows = overlapping_shows.exclude(pk=self.instance.pk)

        # 3. Throw a friendly error if a collision is detected
        if overlapping_shows.exists():
            conflict = overlapping_shows.first()
            # Format times nicely for the frontend alert
            start_str = conflict.start_time.strftime('%I:%M %p')
            end_str = conflict.end_time.strftime('%I:%M %p')
            
            raise serializers.ValidationError({
                "start_time": f"Scheduling Collision! '{screen.screen_name}' is already booked for '{conflict.movie.title}' from {start_str} to {end_str}."
            })

        return data

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'

class TicketItemSerializer(serializers.ModelSerializer):
    seat_label = serializers.CharField(source='seat.seat_label', read_only=True)
    
    class Meta:
        model = TicketItem
        fields = '__all__'
