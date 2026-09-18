from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .auth_views import CustomTokenObtainPairView, CustomTokenRefreshView, RegisterView, SendOTPView, VerifyOTPResetView
from .views import (
    UserViewSet, MovieViewSet, TheaterScreenViewSet, ShowtimeViewSet, 
    SeatViewSet, BookingViewSet, TicketItemViewSet, ContactMessageViewSet,
    InitiatePaymentView, VerifyPaymentView, UserProfileView, MyTicketsView, ChangePasswordView, MyLoyaltyTransactionsView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'movies', MovieViewSet)
router.register(r'screens', TheaterScreenViewSet)
router.register(r'showtimes', ShowtimeViewSet)
router.register(r'seats', SeatViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'tickets', TicketItemViewSet, basename='ticketitem')
router.register(r'contact-messages', ContactMessageViewSet, basename='contactmessage')

urlpatterns = [
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('auth/verify-otp-reset/', VerifyOTPResetView.as_view(), name='verify_otp_reset'),
    path('users/me/', UserProfileView.as_view(), name='user_profile'),
    path('users/me/password/', ChangePasswordView.as_view(), name='change_password'),
    path('users/me/tickets/', MyTicketsView.as_view(), name='my_tickets'),
    path('users/me/loyalty-transactions/', MyLoyaltyTransactionsView.as_view(), name='my_loyalty_transactions'),
    path('payments/initiate/', InitiatePaymentView.as_view(), name='initiate_payment'),
    path('payments/verify/', VerifyPaymentView.as_view(), name='verify_payment'),

    path('', include(router.urls)),
]
