import os
import django
import sys

# URL encode the password which contains an @ symbol
os.environ['DATABASE_URL'] = "postgresql://postgres.qqdnyzewlhznkezffuhq:Subedi%409820523224@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django.setup()

from django.core.management import call_command
print("Running migrations on live database...")
call_command('migrate')
print("Migrations complete.")

from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123', role='Admin')
    print('Superuser created: admin / admin123')
else:
    print('Superuser already exists. Resetting password to admin123 just in case.')
    admin = User.objects.get(username='admin')
    admin.set_password('admin123')
    admin.role = 'Admin'
    admin.save()
    print('Password reset.')
