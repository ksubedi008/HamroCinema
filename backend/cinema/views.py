from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import redirect
import hmac
import hashlib
import base64
import json
import time
from .permissions import IsCustomAdminUser
from .models import User, Movie, TheaterScreen, Showtime, Seat, Booking, TicketItem, ContactMessage
from .serializers import (
    UserSerializer, MovieSerializer, TheaterScreenSerializer, ShowtimeSerializer, 
    SeatSerializer, BookingSerializer, TicketItemSerializer, ContactMessageSerializer
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

    def create(self, request, *args, **kwargs):
        from django.utils import timezone
        showtime_id = request.data.get('showtime')
        if showtime_id:
            try:
                from .models import Showtime
                showtime = Showtime.objects.get(id=showtime_id)
                if showtime.start_time:
                    time_diff = showtime.start_time - timezone.now()
                    if time_diff.total_seconds() < 15 * 60:
                        return Response(
                            {'error': 'Bookings close 15 minutes before the show starts.'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
            except Showtime.DoesNotExist:
                pass
        return super().create(request, *args, **kwargs)

class TicketItemViewSet(viewsets.ModelViewSet):
    serializer_class = TicketItemSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['Admin', 'Manager']:
            return TicketItem.objects.all()
        return TicketItem.objects.filter(booking__user=user)

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsCustomAdminUser()]

class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return Response({"error": "booking_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
            
            total_amount = str(booking.total_amount)
            transaction_uuid = f"{booking.id}-{int(time.time())}"
            product_code = "EPAYTEST"
            
            message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
            secret_key = "8gBm/:&EnhH.1/q"
            
            # Generate HMAC SHA256 signature
            signature = base64.b64encode(
                hmac.new(secret_key.encode('utf-8'), message.encode('utf-8'), hashlib.sha256).digest()
            ).decode('utf-8')
            
            payload = {
                "amount": total_amount,
                "failure_url": "http://localhost:5173/checkout?failed=true",
                "product_delivery_charge": "0",
                "product_service_charge": "0",
                "product_code": product_code,
                "signature": signature,
                "signed_field_names": "total_amount,transaction_uuid,product_code",
                "success_url": "http://localhost:8000/api/payments/verify/",
                "tax_amount": "0",
                "total_amount": total_amount,
                "transaction_uuid": transaction_uuid,
            }
            
            return Response(payload, status=status.HTTP_200_OK)
            
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

class VerifyPaymentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        encoded_data = request.GET.get('data')
        if not encoded_data:
            return redirect('http://localhost:5173/booking-history?payment=failed')
            
        try:
            decoded_data = base64.b64decode(encoded_data).decode('utf-8')
            data_dict = json.loads(decoded_data)
            
            transaction_code = data_dict.get('transaction_code')
            status_esewa = data_dict.get('status')
            total_amount = data_dict.get('total_amount')
            transaction_uuid = data_dict.get('transaction_uuid')
            provided_signature = data_dict.get('signature')
            signed_field_names = data_dict.get('signed_field_names', '')
            
            booking_id = transaction_uuid.split('-')[0]
            booking = Booking.objects.get(id=booking_id)
            
            # Verify signature using signed_field_names
            fields = signed_field_names.split(',')
            message_parts = []
            for field in fields:
                message_parts.append(f"{field}={data_dict.get(field, '')}")
            message = ",".join(message_parts)
            
            secret_key = "8gBm/:&EnhH.1/q"
            expected_signature = base64.b64encode(
                hmac.new(secret_key.encode('utf-8'), message.encode('utf-8'), hashlib.sha256).digest()
            ).decode('utf-8')
            
            if expected_signature != provided_signature:
                return redirect('http://localhost:5173/booking-history?payment=signature_failed')
                
            amount_float = float(str(total_amount).replace(',', ''))
            
            if status_esewa == "COMPLETE" and amount_float == float(booking.total_amount):
                booking.payment_status = 'Completed'
                booking.esewa_ref_id = transaction_code
                booking.save()
                
                # Assign loyalty points (10 per ticket)
                points_earned = booking.tickets.count() * 10
                booking.user.loyalty_points += points_earned
                booking.user.save()
                
                return redirect('http://localhost:5173/booking-history?payment=success')
                
            return redirect('http://localhost:5173/booking-history?payment=failed')
            
        except Exception as e:
            return redirect('http://localhost:5173/booking-history?payment=error')

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        if request.data.get('remove_profile_picture') == 'true':
            if user.profile_picture:
                user.profile_picture.delete(save=False)
            user.profile_picture = None
            user.save()

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTicketsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from .models import TicketItem
        from .serializers import MyTicketSerializer
        tickets = TicketItem.objects.filter(
            booking__user=request.user,
            booking__payment_status='Completed'
        ).order_by('showtime__start_time')
        
        serializer = MyTicketSerializer(tickets, many=True, context={'request': request})
        return Response(serializer.data)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        from django.contrib.auth import update_session_auth_hash
        
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({"error": "Both old and new passwords are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"error": "Incorrect current password."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        
        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
