import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User, FoodCourt

print("\n=== Current Food Court Assignments ===\n")
food_courts = FoodCourt.objects.all()
for fc in food_courts:
    admin_name = fc.admin.username if fc.admin else "No admin"
    print(f"{fc.name} → {admin_name}")

print("\n=== Fixing Assignments ===\n")

# Assign each food court to its corresponding admin
assignments = [
    ('Food Court 1', 'foodcourt1_admin'),
    ('Food Court 2', 'foodcourt2_admin'),
    ('Food Court 3', 'foodcourt3_admin'),
    ('Food Court 4', 'foodcourt4_admin'),
    ('Food Court 5', 'foodcourt5_admin'),
]

for fc_name, admin_username in assignments:
    try:
        food_court = FoodCourt.objects.get(name=fc_name)
        admin = User.objects.get(username=admin_username)
        food_court.admin = admin
        food_court.save()
        print(f"✓ {fc_name} → {admin_username}")
    except (FoodCourt.DoesNotExist, User.DoesNotExist) as e:
        print(f"✗ {fc_name} → {admin_username} - Error: {e}")

print("\n=== Updated Food Court Assignments ===\n")
food_courts = FoodCourt.objects.all()
for fc in food_courts:
    admin_name = fc.admin.username if fc.admin else "No admin"
    print(f"{fc.name} → {admin_name}")

print("\n=== Assignment Complete ===\n")
print("Each food court now has its own dedicated admin:")
print("- Food Court 1 → foodcourt1_admin (password: sri@555)")
print("- Food Court 2 → foodcourt2_admin (password: admin123)")
print("- Food Court 3 → foodcourt3_admin (password: admin123)")
print("- Food Court 4 → foodcourt4_admin (password: admin123)")
print("- Food Court 5 → foodcourt5_admin (password: admin123)")
