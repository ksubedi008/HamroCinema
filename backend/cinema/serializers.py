from datetime import timedelta
from django.db.models import Q, Sum
from django.db import transaction
from rest_framework import serializers
from .models import User, Movie, TheaterScreen, Showtime, Seat, Booking, TicketItem, ContactMessage, LoyaltyTransaction

class UserSerializer(serializers.ModelSerializer):
    loyalty_points = serializers.SerializerMethodField()
    total_bookings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'role', 'date_joined', 'is_active', 'loyalty_points', 'total_bookings']

    def get_total_bookings(self, obj):
        from .models import TicketItem
        return TicketItem.objects.filter(booking__user=obj, booking__payment_status='Completed').count()

    def get_loyalty_points(self, obj):
        if hasattr(obj, 'loyalty_points'):
            return obj.loyalty_points
        from .models import LoyaltyTransaction
        total = LoyaltyTransaction.objects.filter(user=obj).aggregate(Sum('amount'))['amount__sum']
        return total or 0

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
    date = serializers.DateField(format="%Y-%m-%d")
    # The admin shouldn't have to manually calculate this. We will auto-calculate it.
    end_time = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Showtime
        fields = '__all__'

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'

class TicketItemSerializer(serializers.ModelSerializer):
    seat_label = serializers.CharField(source='seat.seat_label', read_only=True)
    
    class Meta:
        model = TicketItem
        fields = '__all__'

    def validate(self, data):
        seat = data.get('seat')
        showtime = data.get('showtime')

        if seat and showtime:
            with transaction.atomic():
                # Pessimistic Locking: Lock the specific Seat row.
                # Any concurrent request trying to book this exact seat will wait here 
                # until this transaction completes, preventing double-bookings.
                try:
                    locked_seat = Seat.objects.select_for_update(nowait=False).get(id=seat.id)
                except Seat.DoesNotExist:
                    raise serializers.ValidationError("Seat does not exist.")

                # With the row exclusively locked, we can safely check for existing tickets
                if TicketItem.objects.filter(seat=locked_seat, showtime=showtime).exists():
                    raise serializers.ValidationError({
                        "seat": "CRITICAL: This seat has already been booked by another user."
                    })
        
        return data

class BookingSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    showtime_details = ShowtimeSerializer(source='showtime', read_only=True)
    tickets = TicketItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'

class MyTicketSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='showtime.movie.title', read_only=True)
    poster = serializers.ImageField(source='showtime.movie.poster', read_only=True)
    start_time = serializers.DateTimeField(source='showtime.start_time', read_only=True)
    screen_name = serializers.CharField(source='showtime.screen.screen_name', read_only=True)
    seat_label = serializers.CharField(source='seat.seat_label', read_only=True)
    booking_id = serializers.IntegerField(source='booking.id', read_only=True)
    payment_status = serializers.CharField(source='booking.payment_status', read_only=True)
    purchased_at = serializers.DateTimeField(source='booking.created_at', read_only=True)
    
    class Meta:
        model = TicketItem
        fields = ['id', 'booking_id', 'movie_title', 'poster', 'start_time', 'screen_name', 'seat_label', 'purchased_at', 'payment_status']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class LoyaltyTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyTransaction
        fields = '__all__'
