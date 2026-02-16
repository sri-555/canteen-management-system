# 🌐 Site Access Guide

## ✅ Servers Running

Both servers are up and running!

### 🟢 Backend Server (Django)
- **URL:** http://localhost:8000
- **API Base:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/
- **Status:** Running ✅

### 🟢 Frontend Server (React + Vite)
- **URL:** http://localhost:5173
- **Status:** Running ✅
- **Hot Reload:** Active ✅

---

## 🚀 Quick Access

### Open the Application
**Click here or copy to browser:**
```
http://localhost:5173
```

---

## 🔐 Login Credentials

### 👨‍🎓 Student Account
```
Username: student1
Password: student123
```
**Features:**
- View food courts with estimated waiting time
- Browse menus
- Place orders
- Manage wallet (₹500 balance)
- Track orders

### 🧑‍🍳 Food Court Admin
```
Username: cafeteria_admin
Password: admin123
```
**Features:**
- ✅ View dashboard with real analytics
- ✅ **Full CRUD on Menu Items** (Add/Edit/Delete)
- ✅ Manage orders (Update status)
- ✅ Update food court settings
- ✅ View daily analytics

### 🏫 Super Admin
```
Username: superadmin
Password: admin123
```
**Features:**
- View all food courts
- Create food courts
- Manage users (block/unblock)
- Create food court admins
- System-wide analytics

---

## 🎯 What to Test

### 1. Test Food Court Admin CRUD Operations

**Login as:** `cafeteria_admin` / `admin123`

#### Test Menu Management (Full CRUD):
1. Go to **Menu Management** (sidebar)
2. **CREATE:** Click "Add Item" → Fill form → Submit
3. **READ:** View all items, use search and filters
4. **UPDATE:** Click edit icon → Modify → Save
5. **DELETE:** Click delete icon → Confirm

#### Test Order Management:
1. Go to **Order Queue** (sidebar)
2. See pending orders
3. Click "Start Preparing" → "Mark Ready" → "Complete Order"
4. Watch auto-refresh (every 30 seconds)

#### View Analytics:
1. Go to **Dashboard**
2. See today's revenue, orders, best seller
3. All data is real from the database!

### 2. Test Student Features

**Login as:** `student1` / `student123`

1. View food courts with waiting times
2. Browse menus
3. Check wallet balance (₹500)
4. View transaction history

### 3. Test Super Admin

**Login as:** `superadmin` / `admin123`

1. View all food courts
2. View all users
3. View system analytics

---

## 🔍 Verify Everything Works

### Check Backend API
Open in browser: http://localhost:8000/api/

You should see the Django REST Framework browsable API.

### Check Admin Panel
Open in browser: http://localhost:8000/admin/

Login with: `superadmin` / `admin123`

### Check Frontend
Open in browser: http://localhost:5173

You should see the login page.

---

## 🎨 Features Implemented

### ✅ Backend (100% Complete)
- 40+ API endpoints
- JWT authentication
- Role-based permissions
- Smart queue prediction
- Wallet system
- Order tracking
- Analytics

### ✅ Frontend Integration
- API service layer
- Authentication flow
- Protected routes
- Real-time data

### ✅ Food Court Admin Pages
- **Dashboard** - Real analytics
- **Menu Management** - Full CRUD operations
- **Order Queue** - Order management with status updates

### ✅ Super Admin APIs
- All endpoints ready
- Just need UI updates

---

## 📊 Sample Data Available

- 1 Super Admin
- 2 Food Court Admins
- 5 Students (₹500 each)
- 2 Food Courts
- 16 Menu Items
- 2 Sample Orders

---

## 🛠️ Developer Tools

### Browser DevTools (F12)
- **Console:** See API calls and errors
- **Network:** Monitor API requests
- **Application → Local Storage:** View tokens

### Backend Logs
Check the terminal running the backend server for API request logs.

### Frontend Logs
Check the terminal running the frontend for build/reload logs.

---

## 🔄 If You Need to Restart

### Stop Servers
I can stop them for you if needed.

### Start Servers Again
```bash
# Backend
cd backend_pro/canteen
python manage.py runserver

# Frontend
cd "front _end"
npm run dev
```

---

## 🎉 Ready to Use!

Everything is set up and running. Just open:

**http://localhost:5173**

And start testing the CRUD operations!

---

## 📝 Quick Test Checklist

- [ ] Open http://localhost:5173
- [ ] Login as cafeteria_admin
- [ ] Go to Menu Management
- [ ] Add a new menu item
- [ ] Edit an existing item
- [ ] Delete an item
- [ ] Go to Order Queue
- [ ] Update an order status
- [ ] View Dashboard analytics
- [ ] Logout and login as student
- [ ] View food courts
- [ ] Check wallet balance

---

## 🆘 Troubleshooting

### Can't access the site?
- Make sure both servers are running
- Check if ports 8000 and 5173 are not blocked
- Try refreshing the page (Ctrl+Shift+R)

### Login not working?
- Check browser console for errors
- Verify backend is running on port 8000
- Clear browser cache and localStorage

### CRUD operations not working?
- Check Network tab in DevTools
- Look for API errors
- Check backend terminal for error logs

---

**Everything is ready! Open http://localhost:5173 and start testing!** 🚀
