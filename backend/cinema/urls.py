from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .auth_views import CustomTokenObtainPairView, CustomTokenRefreshView, RegisterView, PasswordResetRequestView, PasswordResetConfirmView
from .views import (
    UserViewSet, MovieViewSet, TheaterScreenViewSet, ShowtimeViewSet, 
    SeatViewSet, BookingViewSet, TicketItemViewSet, ContactMessageViewSet,
    InitiatePaymentView, VerifyPaymentView
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
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('auth/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('payments/initiate/', InitiatePaymentView.as_view(), name='initiate_payment'),
    path('payments/verify/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('', include(router.urls)),
]
