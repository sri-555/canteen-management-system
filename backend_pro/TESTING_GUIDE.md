# Testing Guide

## Quick Test Scenarios

### Scenario 1: Complete Student Journey

#### Step 1: Register Student
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@college.com",
    "password": "test123",
    "first_name": "Test",
    "last_name": "User",
    "role": "student"
  }'
```

Expected: User created with access token

#### Step 2: Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "student123"
  }'
```

Save the `access` token from response.

#### Step 3: Check Wallet Balance
```bash
curl http://localhost:8000/api/student/wallet/balance/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: `{"balance": "500.00"}`

#### Step 4: View Food Courts
```bash
curl http://localhost:8000/api/food-courts/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: List of food courts with `estimated_waiting_time`

#### Step 5: View Menu
```bash
curl http://localhost:8000/api/food-courts/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Food court details with menu items

#### Step 6: Place Order
```bash
curl -X POST http://localhost:8000/api/student/orders/place/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "food_court": 1,
    "items": [
      {"menu_item_id": 1, "quantity": 2},
      {"menu_item_id": 3, "quantity": 1}
    ]
  }'
```

Expected: Order created, wallet debited

#### Step 7: Check Updated Balance
```bash
curl http://localhost:8000/api/student/wallet/balance/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Reduced balance

#### Step 8: View Orders
```bash
curl http://localhost:8000/api/student/orders/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: List of orders with status

#### Step 9: View Transaction History
```bash
curl http://localhost:8000/api/student/wallet/transactions/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Credit and debit transactions

---

### Scenario 2: Food Court Admin Workflow

#### Step 1: Login as Admin
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cafeteria_admin",
    "password": "admin123"
  }'
```

#### Step 2: View My Food Court
```bash
curl http://localhost:8000/api/admin/food-court/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Step 3: Add Menu Item
```bash
curl -X POST http://localhost:8000/api/admin/menu-items/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Special Thali",
    "description": "Complete meal",
    "price": "120.00",
    "category": "Indian",
    "is_available": true,
    "food_court": 1
  }'
```

#### Step 4: Update Food Court Settings
```bash
curl -X PATCH http://localhost:8000/api/admin/food-court/update/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_open": true,
    "avg_preparation_time": 20,
    "active_staff_count": 5
  }'
```

#### Step 5: View Incoming Orders
```bash
curl http://localhost:8000/api/admin/orders/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Step 6: Update Order Status
```bash
curl -X PATCH http://localhost:8000/api/admin/orders/1/status/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'
```

#### Step 7: Mark Order Ready
```bash
curl -X PATCH http://localhost:8000/api/admin/orders/1/status/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}'
```

#### Step 8: Complete Order
```bash
curl -X PATCH http://localhost:8000/api/admin/orders/1/status/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

#### Step 9: View Analytics
```bash
curl http://localhost:8000/api/admin/analytics/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Expected: Daily statistics

---

### Scenario 3: Super Admin Management

#### Step 1: Login as Super Admin
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "admin123"
  }'
```

#### Step 2: View All Food Courts
```bash
curl http://localhost:8000/api/superadmin/food-courts/ \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN"
```

#### Step 3: Create New Food Court
```bash
curl -X POST http://localhost:8000/api/superadmin/food-courts/create/ \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Block Canteen",
    "description": "Near engineering department",
    "admin": 3,
    "is_open": true,
    "avg_preparation_time": 12,
    "active_staff_count": 2
  }'
```

#### Step 4: Create Food Court Admin
```bash
curl -X POST http://localhost:8000/api/superadmin/admins/create/ \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "engineering_admin",
    "email": "eng@canteen.com",
    "password": "admin123",
    "first_name": "Engineering",
    "last_name": "Admin"
  }'
```

#### Step 5: View All Users
```bash
curl http://localhost:8000/api/superadmin/users/ \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN"
```

#### Step 6: Block User
```bash
curl -X PATCH http://localhost:8000/api/superadmin/users/5/block/ \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_blocked": true}'
```

#### Step 7: View System Analytics
```bash
curl http://localhost:8000/api/superadmin/analytics/ \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN"
```

---

## Testing Smart Queue Prediction

### Test Case 1: No Orders
```bash
# Check food court with no pending orders
curl http://localhost:8000/api/food-courts/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Expected: `estimated_waiting_time: 0.0` or very low

### Test Case 2: Multiple Orders
```bash
# Place 3 orders
# Then check estimated time
curl http://localhost:8000/api/food-courts/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Expected: `estimated_time = (3 × 15) / 3 = 15 minutes`

### Test Case 3: No Staff
```bash
# Set active_staff_count to 0
curl -X PATCH http://localhost:8000/api/admin/food-court/update/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"active_staff_count": 0}'

# Check estimated time
curl http://localhost:8000/api/food-courts/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Expected: `estimated_waiting_time: 0.0`

---

## Error Testing

### Test 1: Insufficient Wallet Balance
```bash
curl -X POST http://localhost:8000/api/student/orders/place/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "food_court": 1,
    "items": [
      {"menu_item_id": 1, "quantity": 100}
    ]
  }'
```
Expected: 400 error with "Insufficient wallet balance"

### Test 2: Closed Food Court
```bash
# Close food court
curl -X PATCH http://localhost:8000/api/admin/food-court/update/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_open": false}'

# Try to order
curl -X POST http://localhost:8000/api/student/orders/place/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "food_court": 1,
    "items": [{"menu_item_id": 1, "quantity": 1}]
  }'
```
Expected: 400 error with "Food court is currently closed"

### Test 3: Unavailable Menu Item
```bash
# Mark item unavailable
curl -X PATCH http://localhost:8000/api/admin/menu-items/1/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_available": false}'

# Try to order
curl -X POST http://localhost:8000/api/student/orders/place/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "food_court": 1,
    "items": [{"menu_item_id": 1, "quantity": 1}]
  }'
```
Expected: 400 error with item name "is not available"

### Test 4: Blocked User
```bash
# Block user (as super admin)
curl -X PATCH http://localhost:8000/api/superadmin/users/6/block/ \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_blocked": true}'

# Try to login as blocked user
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "student123"
  }'
```
Expected: 400 error with "Your account has been blocked"

### Test 5: Invalid Token
```bash
curl http://localhost:8000/api/student/wallet/balance/ \
  -H "Authorization: Bearer INVALID_TOKEN"
```
Expected: 401 Unauthorized

### Test 6: Wrong Role Access
```bash
# Student trying to access admin endpoint
curl http://localhost:8000/api/admin/orders/ \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```
Expected: 403 Forbidden

---

## Postman Testing

### Import Collection
1. Open Postman
2. Click Import
3. Select `Canteen_API.postman_collection.json`
4. Collection imported with all endpoints

### Setup Environment
1. Create new environment "Canteen Local"
2. Add variables:
   - `baseUrl`: `http://localhost:8000/api`
   - `studentToken`: (will be auto-filled)
   - `adminToken`: (will be auto-filled)
   - `superAdminToken`: (will be auto-filled)

### Run Tests
1. Start with Authentication folder
2. Login requests auto-save tokens
3. Test other endpoints with saved tokens

---

## Python Unit Tests

Create `backend_pro/canteen/myapp/tests.py`:

```python
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from .models import User, FoodCourt, MenuItem, Order

class StudentTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(
            username='teststudent',
            password='test123',
            role='student',
            wallet_balance=Decimal('500.00')
        )
        self.admin = User.objects.create_user(
            username='testadmin',
            password='test123',
            role='food_court_admin'
        )
        self.food_court = FoodCourt.objects.create(
            name='Test Cafeteria',
            admin=self.admin,
            is_open=True,
            avg_preparation_time=15,
            active_staff_count=3
        )
        self.menu_item = MenuItem.objects.create(
            food_court=self.food_court,
            name='Test Burger',
            price=Decimal('100.00'),
            is_available=True
        )
    
    def test_login(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'teststudent',
            'password': 'test123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_place_order(self):
        # Login
        response = self.client.post('/api/auth/login/', {
            'username': 'teststudent',
            'password': 'test123'
        })
        token = response.data['access']
        
        # Place order
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.post('/api/student/orders/place/', {
            'food_court': self.food_court.id,
            'items': [
                {'menu_item_id': self.menu_item.id, 'quantity': 2}
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check wallet deducted
        self.student.refresh_from_db()
        self.assertEqual(self.student.wallet_balance, Decimal('300.00'))
    
    def test_insufficient_balance(self):
        # Login
        response = self.client.post('/api/auth/login/', {
            'username': 'teststudent',
            'password': 'test123'
        })
        token = response.data['access']
        
        # Try to order more than balance
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.post('/api/student/orders/place/', {
            'food_court': self.food_court.id,
            'items': [
                {'menu_item_id': self.menu_item.id, 'quantity': 10}
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class SmartQueueTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='testadmin',
            password='test123',
            role='food_court_admin'
        )
        self.food_court = FoodCourt.objects.create(
            name='Test Cafeteria',
            admin=self.admin,
            is_open=True,
            avg_preparation_time=15,
            active_staff_count=3
        )
    
    def test_estimated_time_calculation(self):
        # No orders
        estimated_time = self.food_court.get_estimated_waiting_time()
        self.assertEqual(estimated_time, 0.0)
        
        # Create 3 pending orders
        student = User.objects.create_user(
            username='student',
            password='test123',
            role='student'
        )
        for i in range(3):
            Order.objects.create(
                student=student,
                food_court=self.food_court,
                status='pending',
                total_amount=Decimal('100.00')
            )
        
        # Check estimated time: (3 × 15) / 3 = 15
        estimated_time = self.food_court.get_estimated_waiting_time()
        self.assertEqual(estimated_time, 15.0)
    
    def test_no_staff(self):
        self.food_court.active_staff_count = 0
        self.food_court.save()
        
        estimated_time = self.food_court.get_estimated_waiting_time()
        self.assertEqual(estimated_time, 0.0)
```

### Run Tests
```bash
python manage.py test myapp
```

---

## Load Testing with Apache Bench

### Test 1: Login Endpoint
```bash
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:8000/api/auth/login/
```

### Test 2: Get Food Courts
```bash
ab -n 1000 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/food-courts/
```

---

## Manual Testing Checklist

### Authentication
- [ ] Register new student
- [ ] Register with duplicate username (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Access protected endpoint without token (should fail)
- [ ] Access with expired token (should fail)
- [ ] Refresh token

### Student Features
- [ ] View all food courts
- [ ] View food court menu
- [ ] Check wallet balance
- [ ] Add money to wallet
- [ ] Place order with sufficient balance
- [ ] Try to order with insufficient balance (should fail)
- [ ] Try to order from closed food court (should fail)
- [ ] View order history
- [ ] View transaction history

### Food Court Admin
- [ ] View assigned food court
- [ ] Add new menu item
- [ ] Update menu item price
- [ ] Delete menu item
- [ ] Mark item unavailable
- [ ] Update food court settings
- [ ] Close food court
- [ ] View incoming orders
- [ ] Update order status (all transitions)
- [ ] View daily analytics

### Super Admin
- [ ] View all food courts
- [ ] Create new food court
- [ ] Create food court admin
- [ ] View all users
- [ ] Block user
- [ ] Unblock user
- [ ] View system analytics

### Smart Queue
- [ ] Verify estimated time with no orders
- [ ] Verify estimated time with multiple orders
- [ ] Verify estimated time updates when order status changes
- [ ] Verify estimated time is 0 when staff count is 0

---

## Expected Results Summary

| Test | Expected Result |
|------|----------------|
| Valid login | 200 OK with tokens |
| Invalid login | 400 Bad Request |
| Place order (sufficient balance) | 201 Created |
| Place order (insufficient balance) | 400 Bad Request |
| Order from closed food court | 400 Bad Request |
| Access without token | 401 Unauthorized |
| Access with wrong role | 403 Forbidden |
| Smart queue (no orders) | estimated_time: 0.0 |
| Smart queue (3 orders, 3 staff, 15 min) | estimated_time: 15.0 |
| Blocked user login | 400 Bad Request |

---

## Debugging Tips

### Check Logs
```bash
# Django development server shows logs in console
python manage.py runserver
```

### Django Shell
```bash
python manage.py shell

# Test queries
from myapp.models import *
User.objects.all()
Order.objects.filter(status='pending')
```

### Database Inspection
```bash
python manage.py dbshell

# SQLite commands
.tables
SELECT * FROM myapp_user;
SELECT * FROM myapp_order;
```

All tests should pass successfully with the provided implementation!
