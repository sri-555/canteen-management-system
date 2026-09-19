import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User, FoodCourt, MenuItem
from django.contrib.auth.hashers import make_password

def clear_data():
    """Clear existing data"""
    print("Clearing existing data...")
    MenuItem.objects.all().delete()
    FoodCourt.objects.all().delete()
    User.objects.filter(role__in=['food_court_admin', 'student']).delete()
    print("✓ Cleared existing data\n")

def create_users():
    """Create admin users and students"""
    print("Creating users...")
    
    # Create super admin
    if not User.objects.filter(username='superadmin').exists():
        User.objects.create(
            username='superadmin',
            email='superadmin@foodcourt.com',
            password=make_password('admin123'),
            role='super_admin',
            first_name='Super',
            last_name='Admin'
        )
        print("✓ Created Super Admin")
    
    # Create 5 food court admins
    admins = []
    admin_names = [
        ('admin1', 'North', 'Campus Admin'),
        ('admin2', 'South', 'Campus Admin'),
        ('admin3', 'East', 'Campus Admin'),
        ('admin4', 'West', 'Campus Admin'),
        ('admin5', 'Central', 'Campus Admin'),
    ]
    
    for username, first, last in admin_names:
        admin = User.objects.create(
            username=username,
            email=f'{username}@foodcourt.com',
            password=make_password('admin123'),
            role='food_court_admin',
            first_name=first,
            last_name=last
        )
        admins.append(admin)
        print(f"✓ Created {first} {last}")
    
    # Create students
    for i in range(1, 6):
        User.objects.create(
            username=f'student{i}',
            email=f'student{i}@college.com',
            password=make_password('student123'),
            role='student',
            first_name=f'Student',
            last_name=f'{i}',
            wallet_balance=500.00
        )
    print(f"✓ Created 5 Students with ₹500 wallet balance\n")
    
    return admins

def create_food_courts(admins):
    """Create 5 food courts"""
    print("Creating food courts...")
    
    courts_data = [
        {
            'name': 'Food Court 1',
            'description': 'Serving delicious meals with a wide variety of options',
            'admin': admins[0],
        },
        {
            'name': 'Food Court 2',
            'description': 'Your favorite food destination on campus',
            'admin': admins[1],
        },
        {
            'name': 'Food Court 3',
            'description': 'Quick bites and full meals available',
            'admin': admins[2],
        },
        {
            'name': 'Food Court 4',
            'description': 'Diverse cuisine options for everyone',
            'admin': admins[3],
        },
        {
            'name': 'Food Court 5',
            'description': 'Premium dining experience with quality food',
            'admin': admins[4],
        },
    ]
    
    courts = []
    for data in courts_data:
        court = FoodCourt.objects.create(**data)
        courts.append(court)
        print(f"✓ Created {data['name']}")
    
    print()
    return courts

def create_menu_items(courts):
    """Create comprehensive menu items for all food courts"""
    print("Creating menu items...")
    
    # Define all menu items with categories
    menu_data = [
        # Fast Foods - Noodles
        {'name': 'Chicken Noodles', 'category': 'Fast Foods', 'price': 80, 'description': 'Stir-fried noodles with chicken'},
        {'name': 'Veg Noodles', 'category': 'Fast Foods', 'price': 60, 'description': 'Stir-fried noodles with vegetables'},
        {'name': 'Gobi Noodles', 'category': 'Fast Foods', 'price': 70, 'description': 'Noodles with cauliflower'},
        {'name': 'Egg Noodles', 'category': 'Fast Foods', 'price': 70, 'description': 'Noodles with scrambled eggs'},
        
        # Kothu
        {'name': 'Plain Kothu', 'category': 'Fast Foods', 'price': 50, 'description': 'Shredded parotta with spices'},
        {'name': 'Chicken Kothu', 'category': 'Fast Foods', 'price': 90, 'description': 'Kothu with chicken pieces'},
        {'name': 'Egg Kothu', 'category': 'Fast Foods', 'price': 70, 'description': 'Kothu with eggs'},
        
        # Fried Rice
        {'name': 'Gobi Rice', 'category': 'Fried Rice', 'price': 75, 'description': 'Fried rice with cauliflower'},
        {'name': 'Veg Fried Rice', 'category': 'Fried Rice', 'price': 65, 'description': 'Mixed vegetable fried rice'},
        {'name': 'Chicken Fried Rice', 'category': 'Fried Rice', 'price': 85, 'description': 'Fried rice with chicken'},
        {'name': 'Mushroom Fried Rice', 'category': 'Fried Rice', 'price': 80, 'description': 'Fried rice with mushrooms'},
        
        # Biryani
        {'name': 'Chicken Biryani', 'category': 'Biryani', 'price': 120, 'description': 'Aromatic chicken biryani with raita'},
        
        # Chat Items
        {'name': 'Paani Puri', 'category': 'Chat Items', 'price': 30, 'description': 'Crispy puris with spicy water'},
        {'name': 'Masal Puri', 'category': 'Chat Items', 'price': 35, 'description': 'Puris with spicy masala'},
        {'name': 'Bel Puri', 'category': 'Chat Items', 'price': 35, 'description': 'Puffed rice with chutneys'},
        {'name': 'Gobi Manchurian', 'category': 'Chat Items', 'price': 60, 'description': 'Crispy cauliflower in manchurian sauce'},
        {'name': 'Bhav Baji', 'category': 'Chat Items', 'price': 40, 'description': 'Spicy vegetable curry with pav'},
        {'name': 'Chicken Manchurian', 'category': 'Chat Items', 'price': 80, 'description': 'Chicken in manchurian sauce'},
        {'name': 'Bajji Bonda', 'category': 'Chat Items', 'price': 25, 'description': 'Deep fried snacks'},
        
        # Baked Items
        {'name': 'Egg Puff', 'category': 'Baked Items', 'price': 25, 'description': 'Flaky pastry with egg filling'},
        {'name': 'Samosa', 'category': 'Baked Items', 'price': 20, 'description': 'Crispy triangular pastry'},
        {'name': 'Mushroom Puff', 'category': 'Baked Items', 'price': 30, 'description': 'Puff pastry with mushroom'},
        {'name': 'Chicken Puff', 'category': 'Baked Items', 'price': 35, 'description': 'Puff pastry with chicken'},
        {'name': 'Veg Puff', 'category': 'Baked Items', 'price': 25, 'description': 'Puff pastry with vegetables'},
        
        # Beverages
        {'name': 'Sprite', 'category': 'Beverages', 'price': 20, 'description': 'Chilled lemon-lime soda'},
        {'name': 'Coca Cola', 'category': 'Beverages', 'price': 20, 'description': 'Classic cola drink'},
        {'name': 'Rose Milk', 'category': 'Beverages', 'price': 30, 'description': 'Sweet rose flavored milk'},
        {'name': 'Badam Milk', 'category': 'Beverages', 'price': 35, 'description': 'Almond flavored milk'},
        {'name': 'Wink', 'category': 'Beverages', 'price': 20, 'description': 'Refreshing soft drink'},
        {'name': 'In Cows Milkshake', 'category': 'Beverages', 'price': 50, 'description': 'Creamy milkshake'},
    ]
    
    # Add items to each food court
    total_items = 0
    for court in courts:
        for item_data in menu_data:
            MenuItem.objects.create(
                food_court=court,
                name=item_data['name'],
                category=item_data['category'],
                price=item_data['price'],
                description=item_data['description'],
                is_available=True
            )
            total_items += 1
        print(f"✓ Added {len(menu_data)} items to {court.name}")
    
    print(f"\n✓ Total menu items created: {total_items}\n")

def main():
    print("=" * 60)
    print("COMPREHENSIVE FOOD COURT DATA POPULATION")
    print("=" * 60)
    print()
    
    clear_data()
    admins = create_users()
    courts = create_food_courts(admins)
    create_menu_items(courts)
    
    print("=" * 60)
    print("DATA POPULATION COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print()
    print("Login Credentials:")
    print("-" * 60)
    print("Super Admin:")
    print("  Username: superadmin | Password: admin123")
    print()
    print("Food Court Admins:")
    print("  Username: admin1-5 | Password: admin123")
    print()
    print("Students:")
    print("  Username: student1-5 | Password: student123")
    print("  Wallet Balance: ₹500 each")
    print("=" * 60)

if __name__ == '__main__':
    main()
