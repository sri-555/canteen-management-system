# 🧪 Login Test Guide

## ✅ Fix Applied

I've updated the LoginPage to automatically redirect users after successful login based on their role.

## 🔧 What Was Changed

### LoginPage.tsx
- Added `useEffect` hook to watch for user changes
- Automatically redirects after login:
  - **Student** → `/student`
  - **Food Court Admin** → `/admin`
  - **Super Admin** → `/super-admin`

## 🧪 Test the Login Flow

### 1. Open the Application
Go to: **http://localhost:5173**

### 2. Test Student Login
```
Username: student1
Password: student123
```
**Expected:** Should redirect to `/student` (Student Home page)

### 3. Test Admin Login
```
Username: cafeteria_admin
Password: admin123
```
**Expected:** Should redirect to `/admin` (Admin Dashboard)

### 4. Test Super Admin Login
```
Username: superadmin
Password: admin123
```
**Expected:** Should redirect to `/super-admin` (Revenue Dashboard)

## 🔍 Debugging Steps

If login still doesn't redirect:

### 1. Check Browser Console
- Press F12 to open DevTools
- Go to Console tab
- Look for any errors

### 2. Check Network Tab
- Press F12 to open DevTools
- Go to Network tab
- Try to login
- Look for the POST request to `/api/auth/login/`
- Check if it returns 200 OK with user data

### 3. Check Local Storage
- Press F12 to open DevTools
- Go to Application tab
- Click Local Storage → http://localhost:5173
- After login, you should see:
  - `access_token`
  - `refresh_token`
  - `food_court_user`

### 4. Check Backend Logs
The backend terminal should show:
```
POST /api/auth/login/ 200 OK
```

## 🐛 Common Issues

### Issue: "Invalid credentials" error
**Solution:** Make sure you're using the correct username (not email)
- ✅ Correct: `student1`
- ❌ Wrong: `student1@example.com`

### Issue: CORS error
**Solution:** Make sure backend is running on port 8000

### Issue: Network error
**Solution:** Check that `.env` file has correct API URL:
```
VITE_API_URL=http://localhost:8000/api
```

### Issue: Page doesn't redirect
**Solution:** 
1. Check browser console for errors
2. Make sure the user object has a `role` field
3. Try hard refresh (Ctrl+Shift+R)

## 📊 Expected Flow

1. User enters username and password
2. Click "Sign in"
3. Frontend calls `api.auth.login(username, password)`
4. Backend validates credentials
5. Backend returns JWT tokens and user data
6. Frontend stores tokens in localStorage
7. Frontend sets user in AuthContext
8. `useEffect` in LoginPage detects user change
9. Navigates to appropriate dashboard based on role

## ✅ Verification Checklist

After login, verify:
- [ ] URL changed to correct dashboard
- [ ] No errors in console
- [ ] Tokens stored in localStorage
- [ ] User data visible in the page
- [ ] Can navigate to other pages
- [ ] Logout button works

## 🎯 Test All Roles

### Student (student1/student123)
- [ ] Redirects to `/student`
- [ ] Can see food courts
- [ ] Can view wallet balance

### Admin (cafeteria_admin/admin123)
- [ ] Redirects to `/admin`
- [ ] Can see dashboard
- [ ] Can view orders

### Super Admin (superadmin/admin123)
- [ ] Redirects to `/super-admin`
- [ ] Can see revenue dashboard
- [ ] Can view all food courts

## 🔄 If Still Not Working

1. **Clear browser cache and localStorage:**
   - Press F12
   - Go to Application tab
   - Click "Clear storage"
   - Click "Clear site data"
   - Refresh page

2. **Restart both servers:**
   - Stop both processes
   - Start backend: `cd backend_pro/canteen && python manage.py runserver`
   - Start frontend: `cd "front _end" && npm run dev`

3. **Check the updated code:**
   - Make sure the file was saved
   - Check that Vite hot-reloaded (you should see "hmr update" in terminal)

## 📝 Current Server Status

✅ Backend: Running on http://localhost:8000
✅ Frontend: Running on http://localhost:5173
✅ Login redirect: Fixed and deployed

## 🎉 Success Indicators

When login works correctly, you should see:
1. Loading spinner briefly
2. Page redirects to dashboard
3. User name/info displayed in header
4. Navigation menu appears
5. Dashboard content loads

Try logging in now and it should work! 🚀
