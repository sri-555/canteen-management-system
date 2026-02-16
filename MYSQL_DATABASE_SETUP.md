# MySQL Database Setup - Complete

## ✅ Database Configuration

Your application is now using MySQL database as configured in `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'canteen',
        'USER': 'root',
        'PASSWORD': 'S6r6i6***',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

## ✅ Setup Completed

1. **Database Created**: `canteen` database created in MySQL
2. **Tables Migrated**: All Django models migrated to MySQL tables
3. **Data Populated**: 
   - 5 Food Courts (Food Court 1-5)
   - 140 Menu Items (28 items per food court)
   - 5 Categories: Fast Foods, Kothu, Fried Rice, Chat Items, Beverages
   - 11 Users (1 super admin, 5 food court admins, 5 students)

## 📊 Database Contents

### Users (11 total)
| Role | Count | Usernames |
|------|-------|-----------|
| Super Admin | 1 | superadmin |
| Food Court Admin | 5 | foodcourt1_admin, foodcourt2_admin, foodcourt3_admin, foodcourt4_admin, foodcourt5_admin |
| Student | 5 | student1, student2, student3, student4, student5 |

### Food Courts (5 total)
- Food Court 1 (28 menu items)
- Food Court 2 (28 menu items)
- Food Court 3 (28 menu items)
- Food Court 4 (28 menu items)
- Food Court 5 (28 menu items)

### Menu Items by Category (140 total)
- Fast Foods: 20 items (Noodles varieties)
- Kothu: 15 items (Plain, Chicken, Egg)
- Fried Rice: 25 items (Including Biryani)
- Chat Items: 60 items (Pani Puri, Samosa, Puffs, Manchurian, etc.)
- Beverages: 20 items (Sprite, Coca Cola, Rose Milk, Badam Milk)

## 🔐 Login Credentials

### Super Admin
- **Username**: `superadmin`
- **Password**: `super123`
- **Access**: Full system control, manage food courts and admins

### Students
- **Username**: `student1` (or student2, student3, student4, student5)
- **Password**: `student123`
- **Wallet Balance**: ₹1000 (student1), ₹500 (others)
- **Access**: Browse food courts, order food, manage wallet

### Food Court Admins
- **Username**: `foodcourt1_admin` (or 2, 3, 4, 5)
- **Password**: `admin123`
- **Access**: Manage menu items, view orders, update food court status

## 🚀 Application Status

**Backend (Django)**: ✅ Running on http://127.0.0.1:8000/
- Connected to MySQL database
- All APIs working

**Frontend (React)**: ✅ Running on http://localhost:5173/
- Connected to backend
- All features available

## 🎯 What You Can Do Now

1. **Login as Student** (student1/student123)
   - Browse 5 food courts
   - View 140+ menu items across 5 categories
   - Add items to cart
   - Checkout and place orders
   - Track orders
   - Manage wallet (₹1000 balance)

2. **Login as Food Court Admin** (foodcourt1_admin/admin123)
   - View your food court dashboard
   - Manage 28 menu items
   - Edit item images (upload or URL)
   - Update prices and availability
   - View and manage orders
   - Update food court status

3. **Login as Super Admin** (superadmin/super123)
   - View all 5 food courts
   - Change food court admin assignments
   - View system analytics
   - Manage all users

## 📝 Database Tables Created

The following tables are now in your MySQL `canteen` database:

- `myapp_user` - All users (students, admins, super admin)
- `myapp_foodcourt` - Food court information
- `myapp_menuitem` - Menu items for each food court
- `myapp_order` - Customer orders
- `myapp_orderitem` - Individual items in each order
- `myapp_wallettransaction` - Wallet transaction history
- Plus Django system tables (auth, sessions, etc.)

## 🔧 Maintenance Commands

### View Database Data
```bash
# Connect to MySQL
mysql -u root -p
use canteen;

# View tables
SHOW TABLES;

# View users
SELECT id, username, email, role FROM myapp_user;

# View food courts
SELECT id, name, is_open FROM myapp_foodcourt;

# View menu items count
SELECT category, COUNT(*) as count FROM myapp_menuitem GROUP BY category;
```

### Backup Database
```bash
mysqldump -u root -p canteen > canteen_backup.sql
```

### Restore Database
```bash
mysql -u root -p canteen < canteen_backup.sql
```

## ✅ Everything is Ready!

Your canteen management system is now fully set up with MySQL database and ready to use!

Access the application at: **http://localhost:5173/**
