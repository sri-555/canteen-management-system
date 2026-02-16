# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend_pro
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
cd canteen
python manage.py migrate
```

### 3. Create Sample Data
```bash
python create_sample_data.py
```

### 4. Start Server
```bash
python manage.py runserver
```

Server will run at: `http://localhost:8000`

## Test Credentials

### Super Admin
- Username: `superadmin`
- Password: `admin123`

### Food Court Admins
- Username: `cafeteria_admin` | Password: `admin123`
- Username: `northcampus_admin` | Password: `admin123`

### Students
- Username: `student1` to `student5`
- Password: `student123`
- Each has ₹500 wallet balance

## Quick API Tests

### 1. Login as Student
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"student1\",\"password\":\"student123\"}"
```

Save the `access` token from response.

### 2. View Food Courts
```bash
curl http://localhost:8000/api/food-courts/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. View Menu
```bash
curl http://localhost:8000/api/food-courts/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Place Order
```bash
curl -X POST http://localhost:8000/api/student/orders/place/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"food_court\":1,\"items\":[{\"menu_item_id\":1,\"quantity\":2}]}"
```

### 5. Check Wallet Balance
```bash
curl http://localhost:8000/api/student/wallet/balance/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Admin Panel

Access Django admin at: `http://localhost:8000/admin/`
- Username: `superadmin`
- Password: `admin123`

## Sample Data Included

### Food Courts
1. Main Cafeteria (10 items)
2. North Campus Canteen (6 items)

### Menu Categories
- Fast Food (Burgers)
- Italian (Pizza, Pasta)
- Indian (Biryani, Paneer)
- Chinese (Fried Rice, Noodles)
- Snacks (Samosa, Sandwich, Maggi)
- Beverages (Coffee, Tea, Juice)

## Next Steps

1. Test all API endpoints using Postman or curl
2. Integrate with React frontend
3. Customize menu items and food courts
4. Add more features as needed

## Troubleshooting

### Port Already in Use
```bash
python manage.py runserver 8001
```

### Reset Database
```bash
del db.sqlite3
python manage.py migrate
python create_sample_data.py
```

### Install Missing Packages
```bash
pip install djangorestframework djangorestframework-simplejwt django-cors-headers
```
