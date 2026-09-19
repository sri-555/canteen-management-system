import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User, FoodCourt, MenuItem

print("\n=== Checking Menu Items by Food Court ===\n")

# Get foodcourt2_admin
admin = User.objects.get(username='foodcourt2_admin')
print(f"Admin: {admin.username}")
print(f"Managing Food Courts:")

# Get food courts managed by this admin
food_courts = FoodCourt.objects.filter(admin=admin)
for fc in food_courts:
    print(f"\n{fc.name} (ID: {fc.id})")
    menu_items = MenuItem.objects.filter(food_court=fc)
    print(f"  Menu Items: {menu_items.count()}")
    for item in menu_items:
        print(f"    - {item.name} (₹{item.price})")

print("\n=== All Menu Items in Database ===\n")
all_items = MenuItem.objects.all()
for item in all_items:
    print(f"{item.name} - Food Court: {item.food_court.name} (ID: {item.food_court.id})")

print(f"\nTotal Menu Items: {all_items.count()}")
