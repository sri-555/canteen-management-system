import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("Testing email configuration...")
print(f"From: {settings.DEFAULT_FROM_EMAIL}")
print(f"To: srisabari.n555@gmail.com")
print(f"SMTP Host: {settings.EMAIL_HOST}")
print(f"SMTP Port: {settings.EMAIL_PORT}")
print()

try:
    send_mail(
        subject='Test Email - Canteen Management System',
        message='''
Hello!

This is a test email from the Canteen Management System.

If you receive this email, it means the email notification system is working correctly!

Order notifications will be sent to this email address when students place orders at Food Court 1.

Best regards,
Canteen Management System
        ''',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=['srisabari.n555@gmail.com'],
        fail_silently=False,
    )
    print("✓ Test email sent successfully!")
    print("✓ Check your inbox: srisabari.n555@gmail.com")
    print("✓ If not in inbox, check spam folder")
except Exception as e:
    print(f"✗ Email sending failed!")
    print(f"Error: {str(e)}")
    print()
    print("Common issues:")
    print("1. App Password not set or incorrect in settings.py")
    print("2. 2-Step Verification not enabled on Gmail account")
    print("3. Internet connection issue")
    print()
    print("Please follow the setup guide in EMAIL_NOTIFICATION_SETUP.md")
