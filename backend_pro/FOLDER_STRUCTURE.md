# Backend Folder Structure

```
backend_pro/
│
├── canteen/                          # Django project root
│   ├── canteen/                      # Project configuration
│   │   ├── __init__.py
│   │   ├── settings.py              # Django settings with JWT, CORS, REST framework
│   │   ├── urls.py                  # Main URL configuration
│   │   ├── wsgi.py                  # WSGI configuration
│   │   └── asgi.py                  # ASGI configuration
│   │
│   ├── myapp/                        # Main application
│   │   ├── migrations/              # Database migrations
│   │   │   └── 0001_initial.py     # Initial migration with all models
│   │   ├── __init__.py
│   │   ├── admin.py                 # Django admin configuration
│   │   ├── apps.py                  # App configuration
│   │   ├── models.py                # Database models (User, FoodCourt, MenuItem, Order, etc.)
│   │   ├── serializers.py           # DRF serializers for API
│   │   ├── views.py                 # API views and endpoints
│   │   ├── urls.py                  # App URL routing
│   │   ├── permissions.py           # Custom permission classes
│   │   └── tests.py                 # Unit tests (to be added)
│   │
│   ├── db.sqlite3                    # SQLite database
│   ├── manage.py                     # Django management script
│   └── create_sample_data.py         # Script to populate sample data
│
├── env/                              # Virtual environment (not in git)
│
├── requirements.txt                  # Python dependencies
├── README.md                         # Complete API documentation
├── QUICKSTART.md                     # Quick start guide
├── FOLDER_STRUCTURE.md              # This file
├── API_EXAMPLES.http                # REST Client examples
└── Canteen_API.postman_collection.json  # Postman collection

```

## Key Files Description

### Configuration Files

**settings.py**
- Installed apps: Django REST Framework, JWT, CORS
- Custom user model configuration
- JWT token settings (1 day access, 7 days refresh)
- CORS enabled for frontend integration
- REST framework authentication classes

**urls.py (project)**
- Admin panel route
- API routes under `/api/` prefix

**urls.py (app)**
- All API endpoints organized by role
- Router configuration for viewsets

### Models (models.py)

**User** - Custom user model extending AbstractUser
- Fields: role, wallet_balance, is_blocked, phone
- Roles: student, food_court_admin, super_admin

**FoodCourt**
- Fields: name, description, admin, is_open, avg_preparation_time, active_staff_count
- Method: get_estimated_waiting_time() - Smart queue calculation

**MenuItem**
- Fields: food_court, name, description, price, image_url, is_available, category

**Order**
- Fields: student, food_court, status, total_amount
- Status: pending → preparing → ready → completed

**OrderItem**
- Fields: order, menu_item, quantity, price

**WalletTransaction**
- Fields: user, transaction_type, amount, description, order, balance_after
- Types: credit, debit

### Serializers (serializers.py)

- **UserSerializer** - User data serialization
- **RegisterSerializer** - User registration with validation
- **LoginSerializer** - Login validation
- **FoodCourtSerializer** - Food court with estimated waiting time
- **FoodCourtDetailSerializer** - Food court with menu items
- **MenuItemSerializer** - Menu item CRUD
- **OrderSerializer** - Order with items and details
- **CreateOrderSerializer** - Order placement validation
- **WalletTransactionSerializer** - Transaction history

### Views (views.py)

**Authentication**
- register() - User registration
- login() - JWT token generation
- profile() - Get user profile

**Student Views**
- FoodCourtViewSet - List/retrieve food courts
- StudentOrderViewSet - Order management
- place_order() - Place new order with wallet deduction
- wallet_balance() - Get balance
- wallet_transactions() - Transaction history
- add_wallet_balance() - Recharge wallet

**Food Court Admin Views**
- MenuItemViewSet - CRUD for menu items
- admin_food_court() - Get assigned food court
- update_food_court() - Update settings
- admin_orders() - View all orders
- update_order_status() - Change order status
- admin_analytics() - Daily analytics

**Super Admin Views**
- all_food_courts() - List all food courts
- create_food_court() - Create new food court
- create_food_court_admin() - Create admin user
- all_users() - List all users
- block_user() - Block/unblock users
- system_analytics() - System-wide stats

### Permissions (permissions.py)

- **IsStudent** - Student-only access
- **IsFoodCourtAdmin** - Food court admin access
- **IsSuperAdmin** - Super admin access
- **IsFoodCourtAdminOrSuperAdmin** - Combined access

### Admin Panel (admin.py)

- Custom admin for all models
- User admin with role filtering
- Order admin with inline order items
- Transaction history view

## API Endpoint Structure

```
/api/
├── auth/
│   ├── register/              POST   - Register user
│   ├── login/                 POST   - Login
│   ├── token/refresh/         POST   - Refresh JWT
│   └── profile/               GET    - Get profile
│
├── food-courts/               GET    - List food courts
├── food-courts/{id}/          GET    - Food court details
│
├── student/
│   ├── orders/                GET    - My orders
│   ├── orders/place/          POST   - Place order
│   └── wallet/
│       ├── balance/           GET    - Get balance
│       ├── transactions/      GET    - Transaction history
│       └── add/               POST   - Add money
│
├── admin/
│   ├── food-court/            GET    - My food court
│   ├── food-court/update/     PATCH  - Update settings
│   ├── menu-items/            GET/POST - Menu CRUD
│   ├── menu-items/{id}/       PATCH/DELETE
│   ├── orders/                GET    - All orders
│   ├── orders/{id}/status/    PATCH  - Update status
│   └── analytics/             GET    - Daily analytics
│
└── superadmin/
    ├── food-courts/           GET    - All food courts
    ├── food-courts/create/    POST   - Create food court
    ├── admins/create/         POST   - Create admin
    ├── users/                 GET    - All users
    ├── users/{id}/block/      PATCH  - Block user
    └── analytics/             GET    - System analytics
```

## Database Schema

```sql
User
- id (PK)
- username (unique)
- email
- password (hashed)
- role (student/food_court_admin/super_admin)
- wallet_balance (decimal)
- is_blocked (boolean)
- phone

FoodCourt
- id (PK)
- name
- description
- admin_id (FK → User)
- is_open (boolean)
- avg_preparation_time (integer)
- active_staff_count (integer)
- created_at, updated_at

MenuItem
- id (PK)
- food_court_id (FK → FoodCourt)
- name
- description
- price (decimal)
- image_url
- is_available (boolean)
- category
- created_at, updated_at

Order
- id (PK)
- student_id (FK → User)
- food_court_id (FK → FoodCourt)
- status (pending/preparing/ready/completed/cancelled)
- total_amount (decimal)
- created_at, updated_at

OrderItem
- id (PK)
- order_id (FK → Order)
- menu_item_id (FK → MenuItem)
- quantity (integer)
- price (decimal)

WalletTransaction
- id (PK)
- user_id (FK → User)
- transaction_type (credit/debit)
- amount (decimal)
- description
- order_id (FK → Order, nullable)
- balance_after (decimal)
- created_at
```

## Smart Queue Algorithm

```python
def get_estimated_waiting_time(food_court):
    if food_court.active_staff_count == 0:
        return 0
    
    pending_orders = Order.objects.filter(
        food_court=food_court,
        status__in=['pending', 'preparing']
    ).count()
    
    estimated_time = (pending_orders * food_court.avg_preparation_time) / food_court.active_staff_count
    
    return round(estimated_time, 2)
```

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Role-Based Access Control** - Permission classes for each role
3. **Password Hashing** - Django's built-in password hashing
4. **CORS Configuration** - Controlled cross-origin requests
5. **Blocked User Check** - Prevents blocked users from logging in
6. **Atomic Transactions** - Wallet operations are atomic
7. **Input Validation** - Serializer validation for all inputs

## Sample Data

The `create_sample_data.py` script creates:
- 1 Super Admin
- 2 Food Court Admins
- 5 Students (₹500 each)
- 2 Food Courts
- 16 Menu Items
- 2 Sample Orders

## Testing

Use the provided files:
- **API_EXAMPLES.http** - REST Client examples
- **Canteen_API.postman_collection.json** - Postman collection
- **QUICKSTART.md** - Quick testing guide

## Next Steps

1. Add unit tests in `tests.py`
2. Add order notifications
3. Add payment gateway integration
4. Add image upload for menu items
5. Add order rating system
6. Add real-time order tracking (WebSockets)
7. Add email notifications
8. Deploy to production server
