# Food Court Admin 1 - Credentials Updated

## ✅ Changes Applied

### Updated Credentials
**Username**: `foodcourt1_admin`
**Password**: `sri@555`
**Email**: `srisabari.n555@gmail.com`

### Login Instructions
1. Go to http://localhost:5173/
2. Enter username: `foodcourt1_admin`
3. Enter password: `sri@555`
4. Click "Sign in"

## 📧 Email Notifications Added

### Feature Overview
When a student places an order at Food Court 1, an email notification will be automatically sent to `srisabari.n555@gmail.com` with:
- Order ID and details
- Customer information
- Items ordered with quantities and prices
- Total amount
- Link to admin dashboard

### Email Setup Required

To enable email notifications, you need to:

1. **Generate Gmail App Password**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Generate an App Password for "Mail"
   - Copy the 16-character password

2. **Update settings.py**
   - Open: `backend_pro/canteen/canteen/settings.py`
   - Find: `EMAIL_HOST_PASSWORD = 'your-app-password-here'`
   - Replace with your generated app password
   - Save the file

3. **Restart Django Server**
   - Stop the current server
   - Start again: `python manage.py runserver`

4. **Test Email**
   - Run: `python test_email.py` (in backend_pro/canteen folder)
   - Check inbox: srisabari.n555@gmail.com

### Detailed Setup Guide
See `EMAIL_NOTIFICATION_SETUP.md` for complete instructions.

## 🎯 How It Works

### Order Flow with Email Notification

1. **Student places order**
   - Student adds items to cart
   - Clicks checkout
   - Order is created in database

2. **Email is sent automatically**
   - System sends email to food court admin
   - Email includes all order details
   - Admin receives notification instantly

3. **Admin processes order**
   - Admin logs in to dashboard
   - Views order in Order Queue
   - Updates order status (preparing → ready → completed)

### Sample Email Content

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

## 🔐 All Food Court Admin Credentials

| Food Court | Username | Password | Email |
|------------|----------|----------|-------|
| Food Court 1 | foodcourt1_admin | sri@555 | srisabari.n555@gmail.com |
| Food Court 2 | foodcourt2_admin | admin123 | foodcourt2@canteen.com |
| Food Court 3 | foodcourt3_admin | admin123 | foodcourt3@canteen.com |
| Food Court 4 | foodcourt4_admin | admin123 | foodcourt4@canteen.com |
| Food Court 5 | foodcourt5_admin | admin123 | foodcourt5@canteen.com |

## ⚠️ Important Notes

1. **Two Different Passwords**:
   - Website login: `sri@555`
   - Gmail App Password: 16-character code (for email sending)

2. **Email Sending**:
   - Won't fail order if email fails
   - Errors are logged but don't affect order placement
   - Email is sent asynchronously

3. **Testing**:
   - Use `test_email.py` to verify email setup
   - Place a test order to see the full notification

4. **Security**:
   - Don't share App Password
   - Keep it secure in settings.py
   - Don't commit to Git

## 📝 Quick Test

1. Login as student: `student1` / `student123`
2. Go to Food Court 1
3. Add items to cart
4. Checkout
5. Check email: srisabari.n555@gmail.com
6. You should receive order notification!

## ✅ Status

- [x] Admin 1 email updated to srisabari.n555@gmail.com
- [x] Admin 1 password updated to sri@555
- [x] Email notification code added
- [x] Email configuration added to settings.py
- [ ] Gmail App Password needs to be added
- [ ] Django server needs restart after adding App Password
- [ ] Test email notification

## Next Steps

1. Follow EMAIL_NOTIFICATION_SETUP.md to generate App Password
2. Update EMAIL_HOST_PASSWORD in settings.py
3. Restart Django server
4. Run test_email.py to verify
5. Place a test order to see notification in action
