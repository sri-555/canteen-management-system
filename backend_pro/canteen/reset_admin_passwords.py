import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import User

print("\n=== Resetting Food Court Admin Passwords ===\n")

admins = [
    ('foodcourt1_admin', 'sri@555'),
    ('foodcourt2_admin', 'admin123'),
    ('foodcourt3_admin', 'admin123'),
    ('foodcourt4_admin', 'admin123'),
    ('foodcourt5_admin', 'admin123'),
]

for username, password in admins:
    try:
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        print(f"✓ {username} - Password reset to: {password}")
    except User.DoesNotExist:
        print(f"✗ {username} - User not found")

print("\n=== Password Reset Complete ===\n")
print("You can now login with:")
print("- foodcourt1_admin / sri@555")
print("- foodcourt2_admin / admin123")
print("- foodcourt3_admin / admin123")
print("- foodcourt4_admin / admin123")
print("- foodcourt5_admin / admin123")
