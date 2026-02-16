# Student Registration & Login Guide

## ✅ System Status

The student registration and login system is **fully functional** and ready to use!

## How Students Can Sign Up

### Step 1: Access Registration Page
1. Go to http://localhost:5173/
2. Click "Sign up" link at the bottom of the login form

### Step 2: Fill Registration Form
Students need to provide:
- **First Name** (required)
- **Last Name** (required)
- **Username** (required) - Must be unique
- **Email** (required) - Must be valid email format
- **Phone** (optional) - Can be left empty
- **Password** (required) - Minimum 6 characters
- **Confirm Password** (required) - Must match password

### Step 3: Submit Registration
1. Click "Create Account" button
2. System validates all fields
3. If successful, shows "Registration successful!" message
4. Automatically redirects to login page

### Step 4: Login
1. Enter your username
2. Enter your password
3. Click "Sign in"
4. You'll be logged in as a student

## What New Students Get

When a student registers, they automatically receive:
- ✅ Student role
- ✅ ₹500 starting wallet balance
- ✅ Access to all 5 food courts
- ✅ Ability to browse menus
- ✅ Ability to place orders
- ✅ Order tracking
- ✅ Wallet management

## Example Registration

Here's an example of creating a new student account:

```
First Name: Raj
Last Name: Kumar
Username: rajkumar
Email: raj.kumar@example.com
Phone: +91 9876543210 (optional)
Password: raj@123
Confirm Password: raj@123
```

After registration, login with:
- Username: `rajkumar`
- Password: `raj@123`

## Testing Multiple Student Accounts

You can create as many student accounts as needed. Each account:
- Must have a unique username
- Must have a unique email
- Gets its own ₹500 wallet balance
- Has independent order history
- Can place orders separately

### Test Accounts You Can Create:

1. **Student 1**
   - Username: `alice`
   - Email: `alice@example.com`
   - Password: `alice123`

2. **Student 2**
   - Username: `bob`
   - Email: `bob@example.com`
   - Password: `bob123`

3. **Student 3**
   - Username: `charlie`
   - Email: `charlie@example.com`
   - Password: `charlie123`

## Validation Rules

### Username
- Required
- Must be unique
- Can contain letters, numbers, and underscores
- Cannot be changed after registration

### Email
- Required
- Must be valid email format
- Must be unique
- Used for notifications (if configured)

### Password
- Required
- Minimum 6 characters
- Must match confirmation password
- Stored securely (hashed)

### Phone
- Optional
- Can be any format
- Not validated

## Error Messages

### "Passwords do not match"
- Make sure Password and Confirm Password are exactly the same

### "Password must be at least 6 characters long"
- Use a longer password (minimum 6 characters)

### "Registration failed"
- Username might already exist
- Email might already be registered
- Check all required fields are filled

### "Invalid credentials" (on login)
- Check username spelling
- Check password is correct
- Make sure you registered successfully

## Current Student Accounts

These accounts already exist in the system:

| Username | Password | Wallet Balance |
|----------|----------|----------------|
| student1 | student123 | ₹1000 |
| student2 | student123 | ₹500 |
| student3 | student123 | ₹500 |
| student4 | student123 | ₹500 |
| student5 | student123 | ₹500 |

## Features Available to Students

After logging in, students can:

1. **Browse Food Courts**
   - View all 5 food courts
   - See which are open/closed
   - Check waiting times

2. **View Menus**
   - Browse 140+ menu items
   - Filter by category (Fast Foods, Kothu, Fried Rice, Chat Items, Beverages)
   - See prices and descriptions
   - View food images

3. **Place Orders**
   - Add items to cart
   - View cart summary
   - Checkout with wallet balance
   - Receive order confirmation

4. **Track Orders**
   - View order history
   - See order status (Pending → Preparing → Ready → Completed)
   - View order details

5. **Manage Wallet**
   - Check current balance
   - Add money to wallet
   - View transaction history

## Quick Test Flow

### Test 1: Register New Student
1. Go to http://localhost:5173/
2. Click "Sign up"
3. Fill form with test data
4. Click "Create Account"
5. Should see success message
6. Should redirect to login

### Test 2: Login with New Account
1. Enter username and password
2. Click "Sign in"
3. Should see student dashboard
4. Should see ₹500 wallet balance

### Test 3: Place an Order
1. Click on any food court
2. Add items to cart
3. Click "View Cart"
4. Click "Checkout"
5. Order should be placed successfully
6. Wallet balance should decrease

## Troubleshooting

### Can't register?
- Check if username already exists
- Try a different email address
- Make sure all required fields are filled
- Check password is at least 6 characters

### Can't login after registration?
- Wait a few seconds and try again
- Make sure you're using the correct username (not email)
- Check password is correct
- Try refreshing the page

### Registration successful but can't see dashboard?
- Make sure you logged in (not just registered)
- Check you're using the login page, not register page
- Clear browser cache and try again

## System Architecture

```
Student Registration Flow:
1. Student fills form → Frontend validates
2. Frontend sends data → Backend API (/api/auth/register/)
3. Backend creates user → Sets role as 'student'
4. Backend sets wallet → ₹500 initial balance
5. Backend returns success → Frontend shows message
6. Frontend redirects → Login page
7. Student logs in → Gets JWT token
8. Student accesses → Student dashboard
```

## Security Features

- ✅ Passwords are hashed (not stored in plain text)
- ✅ JWT tokens for authentication
- ✅ Session management
- ✅ Input validation
- ✅ SQL injection protection
- ✅ XSS protection

## Summary

✅ **Registration System**: Fully functional
✅ **Login System**: Working properly
✅ **Multiple Accounts**: Can create unlimited student accounts
✅ **Wallet Balance**: ₹500 for each new student
✅ **All Features**: Available to registered students

Students can now freely register, login, and use all features of the canteen management system!
