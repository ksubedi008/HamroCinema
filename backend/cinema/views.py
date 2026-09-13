from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
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

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsCustomAdminUser()]

class TheaterScreenViewSet(viewsets.ModelViewSet):
    queryset = TheaterScreen.objects.all()
    serializer_class = TheaterScreenSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsCustomAdminUser()]

class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsCustomAdminUser()]

class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsCustomAdminUser()]

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['Admin', 'Manager']:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

class TicketItemViewSet(viewsets.ModelViewSet):
    serializer_class = TicketItemSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['Admin', 'Manager']:
            return TicketItem.objects.all()
        return TicketItem.objects.filter(booking__user=user)
