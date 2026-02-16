import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User

# Update Food Court Admin 1
try:
    admin = User.objects.get(username='foodcourt1_admin')
    admin.email = 'srisabari.n555@gmail.com'
    admin.set_password('sri@555')
    admin.save()
    
    print("✓ Food Court Admin 1 updated successfully!")
    print(f"  Username: {admin.username}")
    print(f"  Email: {admin.email}")
    print(f"  Password: sri@555")
    print(f"  Role: {admin.role}")
    
except User.DoesNotExist:
    print("✗ Food Court Admin 1 not found")
