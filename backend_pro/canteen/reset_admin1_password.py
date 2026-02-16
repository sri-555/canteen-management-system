import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User

# Reset Food Court Admin 1 password
try:
    admin = User.objects.get(username='foodcourt1_admin')
    admin.set_password('admin123')
    admin.save()
    
    print("✓ Food Court Admin 1 password reset successfully!")
    print(f"  Username: {admin.username}")
    print(f"  Email: {admin.email}")
    print(f"  Password: admin123")
    print(f"  Role: {admin.role}")
    
except User.DoesNotExist:
    print("✗ Food Court Admin 1 not found")
