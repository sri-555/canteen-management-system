# 🔄 Backend Fixed - Restart Required

## What Was Fixed

The backend had a bug where food court admins managing multiple food courts would get an error. This has been fixed.

## How to Apply the Fix

### Step 1: Stop the Backend Server
In the terminal running the backend, press `Ctrl+C` to stop it.

### Step 2: Restart the Backend
```cmd
cd backend_pro\canteen
python manage.py runserver
```

### Step 3: Test the Login
1. Go to http://localhost:5173
2. Login with: `foodcourt2_admin` / `admin123`
3. You should now see the menu items and orders!

## What Changed

The backend now handles admins with multiple food courts by selecting the first one. This fixes the error you were seeing.

## All Working Credentials

**Food Court Admins:**
- foodcourt1_admin / sri@555
- foodcourt2_admin / admin123
- foodcourt3_admin / admin123
- foodcourt4_admin / admin123
- foodcourt5_admin / admin123

**Super Admin:**
- superadmin / admin123

**Student:**
- student1 / student123
