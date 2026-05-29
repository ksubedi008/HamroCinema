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

    class Meta:
        model = Showtime
        fields = '__all__'

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
