#!/usr/bin/env python
"""
Production setup script - runs migrations and creates initial data
Run this after deployment: python setup_production.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User, FoodCourt

def setup():
    print("🚀 Starting production setup...")
    
    # Create superuser if it doesn't exist
    if not User.objects.filter(username='superadmin').exists():
        User.objects.create_superuser(
            username='superadmin',
            email='admin@canteen.com',
            password='Admin@123',
            role='super_admin'
        )
        print("✅ Superuser created: superadmin / Admin@123")
    else:
        print("ℹ️  Superuser already exists")
    
    # Create food court admins
    if not User.objects.filter(username='admin1').exists():
        admin1 = User.objects.create_user(
            username='admin1',
            email='admin1@canteen.com',
            password='admin123',
            first_name='Admin',
            last_name='One',
            role='food_court_admin'
        )
        print("✅ Admin1 created: admin1 / admin123")
    else:
        admin1 = User.objects.get(username='admin1')
        print("ℹ️  Admin1 already exists")
    
    if not User.objects.filter(username='admin2').exists():
        admin2 = User.objects.create_user(
            username='admin2',
            email='admin2@canteen.com',
            password='admin123',
            first_name='Admin',
            last_name='Two',
            role='food_court_admin'
        )
        print("✅ Admin2 created: admin2 / admin123")
    else:
        admin2 = User.objects.get(username='admin2')
        print("ℹ️  Admin2 already exists")
    
    # Create food courts
    if not FoodCourt.objects.filter(name='Food Court 1').exists():
        FoodCourt.objects.create(
            name='Food Court 1',
            description='Main cafeteria serving breakfast and lunch',
            admin=admin1,
            is_open=True,
            avg_preparation_time=15,
            active_staff_count=5
        )
        print("✅ Food Court 1 created")
    else:
        print("ℹ️  Food Court 1 already exists")
    
    if not FoodCourt.objects.filter(name='Food Court 2').exists():
        FoodCourt.objects.create(
            name='Food Court 2',
            description='Evening snacks and beverages',
            admin=admin2,
            is_open=True,
            avg_preparation_time=10,
            active_staff_count=3
        )
        print("✅ Food Court 2 created")
    else:
        print("ℹ️  Food Court 2 already exists")
    
    print("🎉 Production setup complete!")
    print("\n📝 Login Credentials:")
    print("Super Admin: superadmin / Admin@123")
    print("Food Court Admin 1: admin1 / admin123")
    print("Food Court Admin 2: admin2 / admin123")

if __name__ == '__main__':
    setup()
