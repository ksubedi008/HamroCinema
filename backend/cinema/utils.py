from django.utils import timezone
from datetime import timedelta
from .models import Booking, TicketItem

def cancel_expired_bookings():
    """
    Finds all 'Pending' bookings that are either:
    - Created more than 15 minutes ago
    - Or their associated showtime has already passed
    
    Marks them as 'Expired' and deletes their associated TicketItem rows
    so that the seats are freed up for other users.
    """
    now = timezone.now()
    fifteen_mins_ago = now - timedelta(minutes=15)
    
    # We query for Pending bookings
    pending_bookings = Booking.objects.filter(payment_status='Pending')
    
    bookings_to_expire = []
    
    for booking in pending_bookings:
        # Check condition 1: older than 15 minutes
        if booking.created_at < fifteen_mins_ago:
            bookings_to_expire.append(booking)
        # Check condition 2: showtime is in the past
        elif booking.showtime.start_time < now:
            bookings_to_expire.append(booking)
            
    if bookings_to_expire:
        booking_ids = [b.id for b in bookings_to_expire]
        
        # 1. Delete TicketItems for these bookings to free up seats
        TicketItem.objects.filter(booking_id__in=booking_ids).delete()
        
        # 2. Update status of these bookings to Expired
        Booking.objects.filter(id__in=booking_ids).update(payment_status='Expired')

from django.db import transaction
from django.db.models import F
from .models import LoyaltyTransaction

@transaction.atomic
def update_user_loyalty(user, amount, transaction_type, description):
    LoyaltyTransaction.objects.create(
        user=user,
        amount=amount,
        transaction_type=transaction_type,
        description=description
    )
