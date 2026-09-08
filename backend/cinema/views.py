from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsCustomAdminUser
from .models import User, Movie, TheaterScreen, Showtime, Seat, Booking, TicketItem
from .serializers import (
    UserSerializer, MovieSerializer, TheaterScreenSerializer, ShowtimeSerializer, 
    SeatSerializer, BookingSerializer, TicketItemSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    # FIX: Secure this admin endpoint using our custom role-based permission class
    permission_classes = [IsCustomAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class TheaterScreenViewSet(viewsets.ModelViewSet):
    queryset = TheaterScreen.objects.all()
    serializer_class = TheaterScreenSerializer

class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer

class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class TicketItemViewSet(viewsets.ModelViewSet):
    queryset = TicketItem.objects.all()
    serializer_class = TicketItemSerializer
