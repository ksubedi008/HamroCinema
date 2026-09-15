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
                "failure_url": "https://l2l1wx8c-5173.inc1.devtunnels.ms/checkout?failed=true",
                "product_delivery_charge": "0",
                "product_service_charge": "0",
                "product_code": product_code,
                "signature": signature,
                "signed_field_names": "total_amount,transaction_uuid,product_code",
                "success_url": "https://l2l1wx8c-8000.inc1.devtunnels.ms/api/payments/verify/",
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
            return redirect('https://l2l1wx8c-5173.inc1.devtunnels.ms/booking-history?payment=failed')
            
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
                return redirect('https://l2l1wx8c-5173.inc1.devtunnels.ms/booking-history?payment=signature_failed')
                
            amount_float = float(str(total_amount).replace(',', ''))
            
            if status_esewa == "COMPLETE" and amount_float == float(booking.total_amount):
                booking.payment_status = 'Completed'
                booking.esewa_ref_id = transaction_code
                booking.save()
                
                # Assign loyalty points (10 per ticket)
                points_earned = booking.tickets.count() * 10
                booking.user.loyalty_points += points_earned
                booking.user.save()
                
                return redirect('https://l2l1wx8c-5173.inc1.devtunnels.ms/booking-history?payment=success')
                
            return redirect('https://l2l1wx8c-5173.inc1.devtunnels.ms/booking-history?payment=failed')
            
        except Exception as e:
            return redirect('https://l2l1wx8c-5173.inc1.devtunnels.ms/booking-history?payment=error')
