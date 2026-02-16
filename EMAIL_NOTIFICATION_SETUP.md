# Email Notification Setup Guide

## Overview
When a student places an order, the food court admin will receive an email notification with order details.

## Food Court Admin 1 Credentials Updated

**Username**: `foodcourt1_admin`
**Password**: `sri@555`
**Email**: `srisabari.n555@gmail.com`

## Email Configuration

The system is configured to send emails via Gmail SMTP. To enable email notifications, you need to set up a Gmail App Password.

### Step 1: Generate Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", enable "2-Step Verification" if not already enabled
4. After enabling 2-Step Verification, go back to Security
5. Under "How you sign in to Google", click on "App passwords"
6. Select "Mail" as the app and "Other" as the device
7. Enter "Canteen Management" as the device name
8. Click "Generate"
9. Copy the 16-character app password (it will look like: `xxxx xxxx xxxx xxxx`)

### Step 2: Update settings.py

Open `backend_pro/canteen/canteen/settings.py` and update the email configuration:

```python
EMAIL_HOST_PASSWORD = 'your-16-character-app-password'  # Replace with the app password you generated
```

**Current configuration:**
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'srisabari.n555@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password-here'  # UPDATE THIS
DEFAULT_FROM_EMAIL = 'Canteen Management <srisabari.n555@gmail.com>'
```

### Step 3: Restart Django Server

After updating the app password, restart the Django server:
```bash
# Stop the current server (Ctrl+C)
# Then start again:
python manage.py runserver
```

## Email Notification Details

### When is the email sent?
- Automatically when a student places an order
- Sent to the food court admin's email address

### What information is included?
- Order ID
- Customer name and email
- Order time
- List of items ordered with quantities and prices
- Total amount
- Link to admin dashboard

### Sample Email:

```
Subject: New Order #123 - Food Court 1

Hello Admin,

You have received a new order at Food Court 1!

Order Details:
--------------
Order ID: #123
Customer: John Doe
Email: student1@canteen.com
Order Time: 2026-02-15 20:30:00

Items Ordered:
  - Chicken Noodles x 2 = ₹160.00
  - Rose Milk x 1 = ₹30.00

Total Amount: ₹190.00
Status: Pending

Please log in to your admin dashboard to view and process this order.

Dashboard: http://localhost:5173/admin/orders

Thank you!
Canteen Management System
```

## Testing Email Notifications

### Test 1: Place an Order
1. Login as student (`student1` / `student123`)
2. Browse Food Court 1
3. Add items to cart
4. Checkout
5. Check the email: `srisabari.n555@gmail.com`

### Test 2: Check Email Delivery
- Check inbox for "New Order" email
- Check spam folder if not in inbox
- Verify all order details are correct

## Troubleshooting

### Email not received?

1. **Check App Password**: Make sure you entered the correct 16-character app password
2. **Check Spam Folder**: Gmail might filter it as spam initially
3. **Verify 2-Step Verification**: Must be enabled for App Passwords to work
4. **Check Django Logs**: Look for email errors in the terminal
5. **Test Email Manually**: Run the test script below

### Test Email Script

Create `backend_pro/canteen/test_email.py`:

```python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

try:
    send_mail(
        subject='Test Email - Canteen Management',
        message='This is a test email. If you receive this, email notifications are working!',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=['srisabari.n555@gmail.com'],
        fail_silently=False,
    )
    print("✓ Test email sent successfully!")
    print("Check your inbox: srisabari.n555@gmail.com")
except Exception as e:
    print(f"✗ Email failed: {str(e)}")
```

Run it:
```bash
python test_email.py
```

## Important Notes

1. **App Password vs Regular Password**: 
   - Use App Password for EMAIL_HOST_PASSWORD in settings.py
   - Use regular password (sri@555) for logging into the website

2. **Security**: 
   - Never commit the App Password to Git
   - Consider using environment variables for production

3. **Email Sending**: 
   - Emails are sent asynchronously
   - Order placement won't fail if email fails
   - Errors are logged but don't affect the order

4. **Gmail Limits**: 
   - Gmail has sending limits (500 emails/day for free accounts)
   - For production, consider using a dedicated email service

## Production Recommendations

For production deployment, consider:
- Using environment variables for email credentials
- Using a dedicated email service (SendGrid, AWS SES, Mailgun)
- Implementing email queues for better performance
- Adding email templates with HTML formatting
- Logging all email attempts for debugging

## Current Status

✅ Food Court Admin 1 email updated to: srisabari.n555@gmail.com
✅ Food Court Admin 1 password updated to: sri@555
✅ Email notification code added to order placement
⚠️ Need to add Gmail App Password to settings.py
⚠️ Need to restart Django server after adding App Password

## Next Steps

1. Generate Gmail App Password (see Step 1 above)
2. Update EMAIL_HOST_PASSWORD in settings.py
3. Restart Django server
4. Test by placing an order
5. Check email inbox
