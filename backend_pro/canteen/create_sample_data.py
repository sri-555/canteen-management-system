"""
Script to create sample data for testing the Canteen Management System
Run: python create_sample_data.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User, FoodCourt, MenuItem, Order, OrderItem, WalletTransaction
from decimal import Decimal

def create_sample_data():
    print("Creating sample data...")
    
    # Create Super Admin
    super_admin = User.objects.create_user(
        username='superadmin',
        email='superadmin@canteen.com',
        password='admin123',
        first_name='Super',
        last_name='Admin',
        role='super_admin',
        is_staff=True,
        is_superuser=True
    )
    print(f"✓ Created Super Admin: {super_admin.username}")
    
    # Create Food Court Admins
    admin1 = User.objects.create_user(
        username='cafeteria_admin',
        email='cafeteria@canteen.com',
        password='admin123',
        first_name='Main',
        last_name='Cafeteria',
        role='food_court_admin'
    )
    
    admin2 = User.objects.create_user(
        username='northcampus_admin',
        email='north@canteen.com',
        password='admin123',
        first_name='North',
        last_name='Campus',
        role='food_court_admin'
    )
    print(f"✓ Created Food Court Admins: {admin1.username}, {admin2.username}")
    
    # Create Students
    students = []
    for i in range(1, 6):
        student = User.objects.create_user(
            username=f'student{i}',
            email=f'student{i}@college.com',
            password='student123',
            first_name=f'Student',
            last_name=f'{i}',
            role='student',
            wallet_balance=Decimal('500.00'),
            phone=f'98765432{i:02d}'
        )
        students.append(student)
        
        # Create initial wallet transaction
        WalletTransaction.objects.create(
            user=student,
            transaction_type='credit',
            amount=Decimal('500.00'),
            description='Initial wallet balance',
            balance_after=Decimal('500.00')
        )
    print(f"✓ Created {len(students)} Students with ₹500 wallet balance each")
    
    # Create Food Courts
    cafeteria = FoodCourt.objects.create(
        name='Main Cafeteria',
        description='Central campus food court with variety of cuisines',
        admin=admin1,
        is_open=True,
        avg_preparation_time=15,
        active_staff_count=3
    )
    
    north_canteen = FoodCourt.objects.create(
        name='North Campus Canteen',
        description='Quick bites and snacks',
        admin=admin2,
        is_open=True,
        avg_preparation_time=10,
        active_staff_count=2
    )
    print(f"✓ Created Food Courts: {cafeteria.name}, {north_canteen.name}")
    
    # Create Menu Items for Main Cafeteria
    cafeteria_items = [
        {'name': 'Chicken Burger', 'price': '150.00', 'category': 'Fast Food', 'description': 'Juicy chicken burger with fries'},
        {'name': 'Veg Burger', 'price': '120.00', 'category': 'Fast Food', 'description': 'Delicious veg burger with fries'},
        {'name': 'Margherita Pizza', 'price': '200.00', 'category': 'Italian', 'description': 'Classic cheese pizza'},
        {'name': 'Pasta Alfredo', 'price': '180.00', 'category': 'Italian', 'description': 'Creamy white sauce pasta'},
        {'name': 'Chicken Biryani', 'price': '160.00', 'category': 'Indian', 'description': 'Aromatic chicken biryani'},
        {'name': 'Paneer Tikka', 'price': '140.00', 'category': 'Indian', 'description': 'Grilled paneer with spices'},
        {'name': 'Fried Rice', 'price': '130.00', 'category': 'Chinese', 'description': 'Veg fried rice'},
        {'name': 'Noodles', 'price': '130.00', 'category': 'Chinese', 'description': 'Hakka noodles'},
        {'name': 'Cold Coffee', 'price': '80.00', 'category': 'Beverages', 'description': 'Chilled coffee'},
        {'name': 'Fresh Juice', 'price': '60.00', 'category': 'Beverages', 'description': 'Seasonal fruit juice'},
    ]
    
    for item_data in cafeteria_items:
        MenuItem.objects.create(
            food_court=cafeteria,
            name=item_data['name'],
            description=item_data['description'],
            price=Decimal(item_data['price']),
            category=item_data['category'],
            is_available=True
        )
    print(f"✓ Created {len(cafeteria_items)} menu items for Main Cafeteria")
    
    # Create Menu Items for North Campus Canteen
    north_items = [
        {'name': 'Samosa', 'price': '20.00', 'category': 'Snacks', 'description': 'Crispy samosa'},
        {'name': 'Sandwich', 'price': '50.00', 'category': 'Snacks', 'description': 'Grilled sandwich'},
        {'name': 'Maggi', 'price': '40.00', 'category': 'Snacks', 'description': 'Hot maggi noodles'},
        {'name': 'Tea', 'price': '15.00', 'category': 'Beverages', 'description': 'Hot tea'},
        {'name': 'Coffee', 'price': '20.00', 'category': 'Beverages', 'description': 'Hot coffee'},
        {'name': 'Pakora', 'price': '30.00', 'category': 'Snacks', 'description': 'Mixed pakora'},
    ]
    
    for item_data in north_items:
        MenuItem.objects.create(
            food_court=north_canteen,
            name=item_data['name'],
            description=item_data['description'],
            price=Decimal(item_data['price']),
            category=item_data['category'],
            is_available=True
        )
    print(f"✓ Created {len(north_items)} menu items for North Campus Canteen")
    
    # Create some sample orders
    burger = MenuItem.objects.get(name='Chicken Burger')
    pizza = MenuItem.objects.get(name='Margherita Pizza')
    coffee = MenuItem.objects.get(name='Cold Coffee')
    
    # Order 1
    order1 = Order.objects.create(
        student=students[0],
        food_court=cafeteria,
        status='preparing',
        total_amount=Decimal('380.00')
    )
    OrderItem.objects.create(order=order1, menu_item=burger, quantity=2, price=burger.price)
    OrderItem.objects.create(order=order1, menu_item=coffee, quantity=1, price=coffee.price)
    
    students[0].wallet_balance -= order1.total_amount
    students[0].save()
    
    WalletTransaction.objects.create(
        user=students[0],
        transaction_type='debit',
        amount=order1.total_amount,
        description=f'Order #{order1.id} at {cafeteria.name}',
        order=order1,
        balance_after=students[0].wallet_balance
    )
    
    # Order 2
    order2 = Order.objects.create(
        student=students[1],
        food_court=cafeteria,
        status='pending',
        total_amount=Decimal('200.00')
    )
    OrderItem.objects.create(order=order2, menu_item=pizza, quantity=1, price=pizza.price)
    
    students[1].wallet_balance -= order2.total_amount
    students[1].save()
    
    WalletTransaction.objects.create(
        user=students[1],
        transaction_type='debit',
        amount=order2.total_amount,
        description=f'Order #{order2.id} at {cafeteria.name}',
        order=order2,
        balance_after=students[1].wallet_balance
    )
    
    print(f"✓ Created 2 sample orders")
    
    print("\n" + "="*60)
    print("Sample Data Created Successfully!")
    print("="*60)
    print("\nLogin Credentials:")
    print("\n1. Super Admin:")
    print("   Username: superadmin")
    print("   Password: admin123")
    print("\n2. Food Court Admins:")
    print("   Username: cafeteria_admin | Password: admin123")
    print("   Username: northcampus_admin | Password: admin123")
    print("\n3. Students (student1 to student5):")
    print("   Username: student1 | Password: student123")
    print("   Username: student2 | Password: student123")
    print("   ... and so on")
    print("\nAll students have ₹500 in their wallets")
    print("="*60)

if __name__ == '__main__':
    # Clear existing data
    print("Clearing existing data...")
    WalletTransaction.objects.all().delete()
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    MenuItem.objects.all().delete()
    FoodCourt.objects.all().delete()
    User.objects.all().delete()
    print("✓ Cleared existing data\n")
    
    create_sample_data()
