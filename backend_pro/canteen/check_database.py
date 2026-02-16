import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import Order, OrderItem, User, FoodCourt, MenuItem
from django.db import connection

print("="*60)
print("DATABASE CONNECTION CHECK")
print("="*60)

# Check database connection
with connection.cursor() as cursor:
    cursor.execute("SELECT DATABASE()")
    db_name = cursor.fetchone()[0]
    print(f"✓ Connected to database: {db_name}")
    print()

# Check tables
print("="*60)
print("DATABASE TABLES")
print("="*60)
with connection.cursor() as cursor:
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print(f"Total tables: {len(tables)}")
    for table in tables:
        if 'myapp' in table[0]:
            cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
            count = cursor.fetchone()[0]
            print(f"  {table[0]}: {count} rows")
print()

# Check Orders
print("="*60)
print("ORDERS IN DATABASE")
print("="*60)
orders = Order.objects.all().order_by('-created_at')[:10]
print(f"Total Orders: {Order.objects.count()}")
print()

if orders:
    for order in orders:
        print(f"Order #{order.id}:")
        print(f"  Student: {order.student.username}")
        print(f"  Food Court: {order.food_court.name}")
        print(f"  Total: ₹{order.total_amount}")
        print(f"  Status: {order.status}")
        print(f"  Created: {order.created_at}")
        print(f"  Items: {order.items.count()}")
        print()
else:
    print("No orders found in database")
    print()

# Check Order Items
print("="*60)
print("ORDER ITEMS")
print("="*60)
order_items = OrderItem.objects.all()[:10]
print(f"Total Order Items: {OrderItem.objects.count()}")
for item in order_items:
    print(f"  {item.menu_item.name} x{item.quantity} - ₹{item.price} (Order #{item.order.id})")
print()

# Check if orders can be created
print("="*60)
print("TEST: Can Create New Order?")
print("="*60)
try:
    # Get a student and food court
    student = User.objects.filter(role='student').first()
    food_court = FoodCourt.objects.first()
    menu_item = MenuItem.objects.filter(food_court=food_court, is_available=True).first()
    
    if student and food_court and menu_item:
        print(f"✓ Student found: {student.username}")
        print(f"✓ Food Court found: {food_court.name}")
        print(f"✓ Menu Item found: {menu_item.name}")
        print("✓ All requirements met for creating orders")
    else:
        print("✗ Missing required data for creating orders")
except Exception as e:
    print(f"✗ Error: {str(e)}")

print()
print("="*60)
print("SUMMARY")
print("="*60)
print(f"Database: {db_name}")
print(f"Orders: {Order.objects.count()}")
print(f"Order Items: {OrderItem.objects.count()}")
print(f"Users: {User.objects.count()}")
print(f"Food Courts: {FoodCourt.objects.count()}")
print(f"Menu Items: {MenuItem.objects.count()}")
print("="*60)
