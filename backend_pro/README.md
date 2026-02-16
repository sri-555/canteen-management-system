# Canteen Management System - Backend API

A comprehensive Django REST API for managing college canteen operations with role-based access control.

## Features

### 3 User Roles
- **Student**: Order food, manage wallet, track orders
- **Food Court Admin**: Manage menu, orders, and analytics
- **Super Admin**: System-wide management and analytics

### Smart Queue Prediction
Estimated waiting time calculated dynamically:
```
Estimated Time = (Pending/Preparing Orders × avg_preparation_time) / active_staff_count
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend_pro
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
cd canteen
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Super Admin
```bash
python manage.py createsuperuser
```
Then update the user's role to 'super_admin' via Django admin or database.

### 4. Run Server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register/` | Register new user | Public |
| POST | `/api/auth/login/` | Login | Public |
| POST | `/api/auth/token/refresh/` | Refresh JWT token | Public |
| GET | `/api/auth/profile/` | Get user profile | Authenticated |

### Student Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/food-courts/` | List all food courts with estimated waiting time |
| GET | `/api/food-courts/{id}/` | Get food court details with menu |
| POST | `/api/student/orders/place/` | Place new order |
| GET | `/api/student/orders/` | Get user's orders |
| GET | `/api/student/orders/{id}/` | Get order details |
| GET | `/api/student/wallet/balance/` | Get wallet balance |
| GET | `/api/student/wallet/transactions/` | Get transaction history |
| POST | `/api/student/wallet/add/` | Add money to wallet |

### Food Court Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/food-court/` | Get assigned food court |
| PATCH | `/api/admin/food-court/update/` | Update food court settings |
| GET | `/api/admin/menu-items/` | List menu items |
| POST | `/api/admin/menu-items/` | Add menu item |
| PATCH | `/api/admin/menu-items/{id}/` | Update menu item |
| DELETE | `/api/admin/menu-items/{id}/` | Delete menu item |
| GET | `/api/admin/orders/` | Get all orders |
| PATCH | `/api/admin/orders/{id}/status/` | Update order status |
| GET | `/api/admin/analytics/` | Get daily analytics |

### Super Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superadmin/food-courts/` | List all food courts |
| POST | `/api/superadmin/food-courts/create/` | Create food court |
| POST | `/api/superadmin/admins/create/` | Create food court admin |
| GET | `/api/superadmin/users/` | List all users |
| PATCH | `/api/superadmin/users/{id}/block/` | Block/unblock user |
| GET | `/api/superadmin/analytics/` | System-wide analytics |

## Request/Response Examples

### 1. Register Student
**Request:**
```json
POST /api/auth/register/
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "role": "student"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "wallet_balance": "0.00",
    "phone": "1234567890",
    "is_blocked": false
  },
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 2. Login
**Request:**
```json
POST /api/auth/login/
{
  "username": "john_doe",
  "password": "secure123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student",
    "wallet_balance": "100.00"
  },
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. Get Food Courts (with Smart Queue)
**Request:**
```
GET /api/food-courts/
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Main Cafeteria",
    "description": "Central food court",
    "is_open": true,
    "avg_preparation_time": 15,
    "active_staff_count": 3,
    "estimated_waiting_time": 10.0,
    "admin": 2,
    "admin_name": "admin_user",
    "created_at": "2026-02-10T10:00:00Z",
    "updated_at": "2026-02-13T08:30:00Z"
  }
]
```

### 4. Get Food Court Menu
**Request:**
```
GET /api/food-courts/1/
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "name": "Main Cafeteria",
  "description": "Central food court",
  "is_open": true,
  "avg_preparation_time": 15,
  "active_staff_count": 3,
  "estimated_waiting_time": 10.0,
  "menu_items": [
    {
      "id": 1,
      "name": "Burger",
      "description": "Chicken burger with fries",
      "price": "150.00",
      "image_url": "https://example.com/burger.jpg",
      "is_available": true,
      "category": "Fast Food",
      "food_court": 1
    },
    {
      "id": 2,
      "name": "Pizza",
      "description": "Margherita pizza",
      "price": "200.00",
      "image_url": null,
      "is_available": true,
      "category": "Fast Food",
      "food_court": 1
    }
  ]
}
```

### 5. Add Money to Wallet
**Request:**
```json
POST /api/student/wallet/add/
Authorization: Bearer <access_token>
{
  "amount": "500.00"
}
```

**Response:**
```json
{
  "balance": "500.00",
  "message": "Wallet recharged successfully"
}
```

### 6. Place Order
**Request:**
```json
POST /api/student/orders/place/
Authorization: Bearer <access_token>
{
  "food_court": 1,
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2
    },
    {
      "menu_item_id": 2,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "student": 1,
  "student_name": "john_doe",
  "food_court": 1,
  "food_court_name": "Main Cafeteria",
  "status": "pending",
  "total_amount": "500.00",
  "items": [
    {
      "id": 1,
      "menu_item": 1,
      "menu_item_name": "Burger",
      "quantity": 2,
      "price": "150.00"
    },
    {
      "id": 2,
      "menu_item": 2,
      "menu_item_name": "Pizza",
      "quantity": 1,
      "price": "200.00"
    }
  ],
  "created_at": "2026-02-13T12:30:00Z",
  "updated_at": "2026-02-13T12:30:00Z"
}
```

### 7. Get Wallet Transactions
**Request:**
```
GET /api/student/wallet/transactions/
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": 2,
    "transaction_type": "debit",
    "amount": "500.00",
    "description": "Order #1 at Main Cafeteria",
    "balance_after": "0.00",
    "created_at": "2026-02-13T12:30:00Z"
  },
  {
    "id": 1,
    "transaction_type": "credit",
    "amount": "500.00",
    "description": "Wallet recharge",
    "balance_after": "500.00",
    "created_at": "2026-02-13T12:00:00Z"
  }
]
```

### 8. Add Menu Item (Food Court Admin)
**Request:**
```json
POST /api/admin/menu-items/
Authorization: Bearer <access_token>
{
  "name": "Pasta",
  "description": "White sauce pasta",
  "price": "180.00",
  "category": "Italian",
  "is_available": true,
  "food_court": 1
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Pasta",
  "description": "White sauce pasta",
  "price": "180.00",
  "image_url": null,
  "is_available": true,
  "category": "Italian",
  "food_court": 1
}
```

### 9. Update Food Court Settings (Food Court Admin)
**Request:**
```json
PATCH /api/admin/food-court/update/
Authorization: Bearer <access_token>
{
  "is_open": true,
  "avg_preparation_time": 20,
  "active_staff_count": 4
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Main Cafeteria",
  "description": "Central food court",
  "is_open": true,
  "avg_preparation_time": 20,
  "active_staff_count": 4,
  "estimated_waiting_time": 7.5,
  "admin": 2,
  "admin_name": "admin_user"
}
```

### 10. Update Order Status (Food Court Admin)
**Request:**
```json
PATCH /api/admin/orders/1/status/
Authorization: Bearer <access_token>
{
  "status": "preparing"
}
```

**Response:**
```json
{
  "id": 1,
  "student": 1,
  "student_name": "john_doe",
  "food_court": 1,
  "food_court_name": "Main Cafeteria",
  "status": "preparing",
  "total_amount": "500.00",
  "items": [...],
  "created_at": "2026-02-13T12:30:00Z",
  "updated_at": "2026-02-13T12:35:00Z"
}
```

### 11. Get Admin Analytics
**Request:**
```
GET /api/admin/analytics/
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "total_orders_today": 15,
  "revenue_today": "4500.00",
  "most_selling_item": "Burger",
  "most_selling_quantity": 25
}
```

### 12. Create Food Court (Super Admin)
**Request:**
```json
POST /api/superadmin/food-courts/create/
Authorization: Bearer <access_token>
{
  "name": "North Campus Canteen",
  "description": "Food court at north campus",
  "admin": 3,
  "is_open": true,
  "avg_preparation_time": 15,
  "active_staff_count": 2
}
```

**Response:**
```json
{
  "id": 2,
  "name": "North Campus Canteen",
  "description": "Food court at north campus",
  "is_open": true,
  "avg_preparation_time": 15,
  "active_staff_count": 2,
  "estimated_waiting_time": 0.0,
  "admin": 3,
  "admin_name": "north_admin"
}
```

### 13. Block/Unblock User (Super Admin)
**Request:**
```json
PATCH /api/superadmin/users/5/block/
Authorization: Bearer <access_token>
{
  "is_blocked": true
}
```

**Response:**
```json
{
  "id": 5,
  "username": "problem_user",
  "email": "problem@example.com",
  "role": "student",
  "wallet_balance": "50.00",
  "is_blocked": true
}
```

### 14. System Analytics (Super Admin)
**Request:**
```
GET /api/superadmin/analytics/
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "total_revenue": "125000.00",
  "today_revenue": "8500.00",
  "total_orders": 450,
  "total_students": 120,
  "total_food_courts": 3
}
```

## Database Models

### User (extends AbstractUser)
- username, email, password (inherited)
- role: student | food_court_admin | super_admin
- wallet_balance: Decimal
- is_blocked: Boolean
- phone: String

### FoodCourt
- name: String
- description: Text
- admin: ForeignKey(User)
- is_open: Boolean
- avg_preparation_time: Integer (minutes)
- active_staff_count: Integer
- timestamps

### MenuItem
- food_court: ForeignKey(FoodCourt)
- name: String
- description: Text
- price: Decimal
- image_url: URL
- is_available: Boolean
- category: String
- timestamps

### Order
- student: ForeignKey(User)
- food_court: ForeignKey(FoodCourt)
- status: pending | preparing | ready | completed | cancelled
- total_amount: Decimal
- timestamps

### OrderItem
- order: ForeignKey(Order)
- menu_item: ForeignKey(MenuItem)
- quantity: Integer
- price: Decimal

### WalletTransaction
- user: ForeignKey(User)
- transaction_type: credit | debit
- amount: Decimal
- description: String
- order: ForeignKey(Order, nullable)
- balance_after: Decimal
- created_at: DateTime

## Authentication

All protected endpoints require JWT authentication:
```
Authorization: Bearer <access_token>
```

Access tokens expire after 1 day. Use the refresh token to get a new access token:
```json
POST /api/auth/token/refresh/
{
  "refresh": "<refresh_token>"
}
```

## Order Status Flow
1. **pending** - Order placed, payment deducted
2. **preparing** - Food court started preparing
3. **ready** - Order ready for pickup
4. **completed** - Order collected by student
5. **cancelled** - Order cancelled (if needed)

## Notes
- All monetary values are in Decimal format with 2 decimal places
- Timestamps are in ISO 8601 format with UTC timezone
- Smart queue prediction updates in real-time based on active orders
- Wallet transactions are atomic to prevent race conditions
- Students can only order from open food courts with available items
