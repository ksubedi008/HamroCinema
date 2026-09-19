from django.core.management.base import BaseCommand
from cinema.models import LoyaltyTransaction, Booking

class Command(BaseCommand):
    help = 'Cleans up existing loyalty transactions to use the human-readable movie title format.'

    def handle(self, *args, **kwargs):
        transactions = LoyaltyTransaction.objects.all()
        updated_count = 0

        for t in transactions:
            try:
                if t.description.startswith('Spent on booking'):
                    # Old format: "Spent on booking 104"
                    booking_id = t.description.split(' ')[-1]
                    booking = Booking.objects.get(id=booking_id)
                    t.description = f'Redeemed tickets for {booking.showtime.movie.title}'
                    t.save()
                    updated_count += 1
                
                elif t.description == 'Points earned from ticket booking' and t.transaction_type == 'Earned':
                    # Find the most recent completed booking for this user to associate the points
                    booking = Booking.objects.filter(
                        user=t.user, 
                        payment_status='Completed'
                    ).order_by('-created_at').first()
                    
                    if booking:
                        t.description = f'Points earned from {booking.showtime.movie.title}'
                        t.save()
                        updated_count += 1
                        
            except Booking.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Booking not found for transaction {t.id}, skipping.'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error processing transaction {t.id}: {str(e)}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} legacy loyalty transactions.'))
