import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User
from decimal import Decimal

def create_users():
    print("Creating users...")
    
    # Create Super Admin
    superadmin, created = User.objects.get_or_create(
        username='superadmin',
        defaults={
            'email': 'superadmin@canteen.com',
            'first_name': 'Super',
            'last_name': 'Admin',
            'role': 'super_admin',
            'is_staff': True,
            'is_superuser': True,
            'wallet_balance': Decimal('0.00')
        }
    )
    if created:
        superadmin.set_password('super123')
        superadmin.save()
        print("✓ Created Super Admin (username: superadmin, password: super123)")
    else:
        print("✓ Super Admin already exists")
    
    # Create Student
    student, created = User.objects.get_or_create(
        username='student1',
        defaults={
            'email': 'student1@canteen.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'student',
            'wallet_balance': Decimal('1000.00')
        }
    )
    if created:
        student.set_password('student123')
        student.save()
        print("✓ Created Student (username: student1, password: student123, balance: ₹1000)")
    else:
        print("✓ Student already exists")
    
    # Create more students
    for i in range(2, 6):
        student, created = User.objects.get_or_create(
            username=f'student{i}',
            defaults={
                'email': f'student{i}@canteen.com',
                'first_name': f'Student',
                'last_name': f'{i}',
                'role': 'student',
                'wallet_balance': Decimal('500.00')
            }
        )
        if created:
            student.set_password('student123')
            student.save()
            print(f"✓ Created Student {i} (username: student{i}, password: student123)")
    
    print("\n" + "="*50)
    print("USER SUMMARY")
    print("="*50)
    print(f"Total Users: {User.objects.count()}")
    print(f"  - Super Admins: {User.objects.filter(role='super_admin').count()}")
    print(f"  - Food Court Admins: {User.objects.filter(role='food_court_admin').count()}")
    print(f"  - Students: {User.objects.filter(role='student').count()}")
    
    print("\n✅ User creation completed!")
    print("\nLogin Credentials:")
    print("="*50)
    print("Super Admin:")
    print("  Username: superadmin")
    print("  Password: super123")
    print("\nStudent:")
    print("  Username: student1")
    print("  Password: student123")
    print("\nFood Court Admins:")
    print("  Username: foodcourt1_admin (or 2, 3, 4, 5)")
    print("  Password: admin123")

if __name__ == '__main__':
    create_users()
