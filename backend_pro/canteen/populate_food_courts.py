import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User, FoodCourt, MenuItem
from decimal import Decimal

def create_food_courts_and_menus():
    print("Starting to populate food courts and menu items...")
    
    # Create 5 food court admins
    admins = []
    for i in range(1, 6):
        admin, created = User.objects.get_or_create(
            username=f'foodcourt{i}_admin',
            defaults={
                'email': f'foodcourt{i}@canteen.com',
                'first_name': f'Admin',
                'last_name': f'{i}',
                'role': 'food_court_admin',
                'is_staff': True
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            print(f"✓ Created admin for Food Court {i}")
        admins.append(admin)
    
    # Menu items for each category
    menu_data = {
        'Fast Foods': [
            {'name': 'Chicken Noodles', 'price': '80.00', 'description': 'Delicious chicken noodles with vegetables'},
            {'name': 'Veg Noodles', 'price': '60.00', 'description': 'Fresh vegetable noodles'},
            {'name': 'Gobi Noodles', 'price': '70.00', 'description': 'Cauliflower noodles with spices'},
            {'name': 'Egg Noodles', 'price': '75.00', 'description': 'Noodles with scrambled eggs'},
        ],
        'Kothu': [
            {'name': 'Plain Kothu', 'price': '50.00', 'description': 'Traditional plain kothu parotta'},
            {'name': 'Chicken Kothu', 'price': '90.00', 'description': 'Spicy chicken kothu parotta'},
            {'name': 'Egg Kothu', 'price': '70.00', 'description': 'Egg kothu parotta'},
        ],
        'Fried Rice': [
            {'name': 'Gobi Rice', 'price': '65.00', 'description': 'Cauliflower fried rice'},
            {'name': 'Veg Rice', 'price': '60.00', 'description': 'Mixed vegetable fried rice'},
            {'name': 'Chicken Fried Rice', 'price': '85.00', 'description': 'Chicken fried rice with vegetables'},
            {'name': 'Mushroom Fried Rice', 'price': '75.00', 'description': 'Mushroom fried rice'},
            {'name': 'Chicken Biryani', 'price': '120.00', 'description': 'Authentic chicken biryani'},
        ],
        'Chat Items': [
            {'name': 'Paani Puri', 'price': '30.00', 'description': 'Crispy pani puri with tangy water'},
            {'name': 'Masal Puri', 'price': '35.00', 'description': 'Spicy masala puri'},
            {'name': 'Bel Puri', 'price': '40.00', 'description': 'Mumbai style bhel puri'},
            {'name': 'Gobi Manchurian', 'price': '70.00', 'description': 'Indo-Chinese cauliflower manchurian'},
            {'name': 'Bhav Baji', 'price': '45.00', 'description': 'Pav bhaji with butter'},
            {'name': 'Chicken Manchurian', 'price': '95.00', 'description': 'Spicy chicken manchurian'},
            {'name': 'Bajji Bonda', 'price': '25.00', 'description': 'Mixed bajji and bonda'},
            {'name': 'Egg Puff', 'price': '20.00', 'description': 'Flaky egg puff'},
            {'name': 'Samosa', 'price': '15.00', 'description': 'Crispy vegetable samosa'},
            {'name': 'Mushroom Puff', 'price': '25.00', 'description': 'Mushroom filled puff'},
            {'name': 'Chicken Puff', 'price': '30.00', 'description': 'Chicken filled puff'},
            {'name': 'Veg Puff', 'price': '18.00', 'description': 'Vegetable puff'},
        ],
        'Beverages': [
            {'name': 'Sprite', 'price': '20.00', 'description': 'Chilled sprite'},
            {'name': 'Coca Cola', 'price': '20.00', 'description': 'Chilled coca cola'},
            {'name': 'Rose Milk', 'price': '30.00', 'description': 'Sweet rose flavored milk'},
            {'name': 'Badam Milk', 'price': '35.00', 'description': 'Almond flavored milk'},
        ],
    }
    
    # Create 5 food courts with all menu items
    for i in range(1, 6):
        food_court, created = FoodCourt.objects.get_or_create(
            name=f'Food Court {i}',
            defaults={
                'description': f'Food Court {i} - Serving delicious meals',
                'admin': admins[i-1],
                'is_open': True,
                'avg_preparation_time': 15,
                'active_staff_count': 5
            }
        )
        
        if created:
            print(f"\n✓ Created Food Court {i}")
        else:
            print(f"\n✓ Food Court {i} already exists")
        
        # Add all menu items to this food court
        items_created = 0
        for category, items in menu_data.items():
            for item_data in items:
                menu_item, item_created = MenuItem.objects.get_or_create(
                    food_court=food_court,
                    name=item_data['name'],
                    defaults={
                        'description': item_data['description'],
                        'price': Decimal(item_data['price']),
                        'category': category,
                        'is_available': True,
                    }
                )
                if item_created:
                    items_created += 1
        
        print(f"  → Added {items_created} new menu items")
    
    # Print summary
    print("\n" + "="*50)
    print("SUMMARY")
    print("="*50)
    print(f"Total Food Courts: {FoodCourt.objects.count()}")
    print(f"Total Menu Items: {MenuItem.objects.count()}")
    print("\nCategories:")
    for category in menu_data.keys():
        count = MenuItem.objects.filter(category=category).count()
        print(f"  - {category}: {count} items")
    
    print("\n✅ Database population completed successfully!")
    print("\nYou can now login and browse all 5 food courts with their menus.")

if __name__ == '__main__':
    create_food_courts_and_menus()
