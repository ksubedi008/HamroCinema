from rest_framework import generics, status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import random
from .serializers import UserSerializer
from .models import PasswordResetOTP

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'profile_picture': self.user.profile_picture.url if self.user.profile_picture else None
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'This email address is already in use.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=data.get('username')).exists():
            return Response({'error': 'This username is not available.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            role=data.get('role', 'Customer')
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Silently return success to prevent email enumeration
            return Response({'message': 'If an account with that email exists, a 6-digit OTP has been sent.'}, status=status.HTTP_200_OK)

        # Generate a 6-digit OTP
        otp_code = f"{random.randint(100000, 999999)}"
        
        # Invalidate previous unused OTPs for this user
        PasswordResetOTP.objects.filter(user=user, is_used=False).update(is_used=True)
        
        # Save new OTP
        PasswordResetOTP.objects.create(user=user, otp_code=otp_code)
        
        # Simulate sending the email by printing to terminal
        print("\n" + "="*50)
        print(f" PASSWORD RESET OTP FOR {user.email}: {otp_code} ")
        print("="*50 + "\n")

        # Optionally, you can still send the email:
        # send_mail(
        #     subject='HamroCinema - Password Reset OTP',
        #     message=f'Your 6-digit password reset code is: {otp_code}\n\nThis code will expire in 10 minutes.',
        #     from_email=settings.EMAIL_HOST_USER,
        #     recipient_list=[user.email],
        #     fail_silently=True,
        # )

        return Response({'message': 'If an account with that email exists, a 6-digit OTP has been sent.'}, status=status.HTTP_200_OK)

class VerifyOTPResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp_code')
        new_password = request.data.get('new_password')

        if not email or not otp_code or not new_password:
            return Response({'error': 'Email, OTP code, and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid email or OTP code.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the latest valid OTP
        try:
            otp_record = PasswordResetOTP.objects.filter(
                user=user, 
                otp_code=otp_code, 
                is_used=False
            ).latest('created_at')
        except PasswordResetOTP.DoesNotExist:
            return Response({'error': 'Invalid or expired OTP code.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP is older than 10 minutes
        expiry_time = otp_record.created_at + timezone.timedelta(minutes=10)
        if timezone.now() > expiry_time:
            otp_record.is_used = True
            otp_record.save()
            return Response({'error': 'OTP code has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        # OTP is valid, reset password
        user.set_password(new_password)
        user.save()

        # Mark OTP as used
        otp_record.is_used = True
        otp_record.save()

        return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
