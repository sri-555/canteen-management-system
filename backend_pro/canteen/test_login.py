import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User

# Test student1
try:
    user = User.objects.get(username='student1')
    print(f"User found: {user.username}")
    print(f"Email: {user.email}")
    print(f"Role: {user.role}")
    print(f"Is active: {user.is_active}")
    print(f"Password check: {user.check_password('student123')}")
    
    # Try to authenticate
    from django.contrib.auth import authenticate
    auth_user = authenticate(username='student1', password='student123')
    print(f"Authentication result: {auth_user}")
    
except User.DoesNotExist:
    print("User student1 not found!")
