from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Movie, TheaterScreen, Showtime, Seat, Booking, TicketItem

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Role', {'fields': ('role',)}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Movie)
admin.site.register(TheaterScreen)
admin.site.register(Showtime)
admin.site.register(Seat)
admin.site.register(Booking)
admin.site.register(TicketItem)
