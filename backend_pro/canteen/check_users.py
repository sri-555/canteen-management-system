import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User, FoodCourt

print("\n=== ALL USERS IN DATABASE ===\n")
users = User.objects.all()
for user in users:
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print(f"Role: {user.role}")
    print(f"Active: {user.is_active}")
    print("-" * 50)

print("\n=== ALL FOOD COURTS ===\n")
food_courts = FoodCourt.objects.all()
for fc in food_courts:
    admin_name = fc.admin.username if fc.admin else "No admin"
    print(f"Name: {fc.name}")
    print(f"Admin: {admin_name}")
    print(f"Open: {fc.is_open}")
    print("-" * 50)

print(f"\nTotal Users: {users.count()}")
print(f"Total Food Courts: {food_courts.count()}")
