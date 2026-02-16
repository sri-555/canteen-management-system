# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  (Student App, Admin Dashboard, Super Admin Panel)         │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS + JWT
                     │ REST API Calls
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Django REST API                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              URL Router (urls.py)                    │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │         Authentication Middleware                    │  │
│  │         (JWT Token Validation)                       │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │         Permission Classes                           │  │
│  │  (IsStudent, IsFoodCourtAdmin, IsSuperAdmin)        │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Views (views.py)                        │  │
│  │  - Authentication Views                              │  │
│  │  - Student Views                                     │  │
│  │  - Food Court Admin Views                           │  │
│  │  - Super Admin Views                                │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │         Serializers (serializers.py)                 │  │
│  │  - Data Validation                                   │  │
│  │  - JSON Serialization                               │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │           Models (models.py)                         │  │
│  │  - User, FoodCourt, MenuItem                        │  │
│  │  - Order, OrderItem, WalletTransaction              │  │
│  └────────────────────┬─────────────────────────────────┘  │
└────────────────────────┼─────────────────────────────────────┘
                         │ Django ORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database                           │
│  (PostgreSQL/MySQL for Production)                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Student    │  │ Food Court   │  │    Super     │    │
│  │   Endpoints  │  │    Admin     │  │    Admin     │    │
│  │              │  │  Endpoints   │  │  Endpoints   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                  │             │
│         └─────────────────┼──────────────────┘             │
│                           │                                │
│  ┌────────────────────────▼──────────────────────────┐    │
│  │         Business Logic Layer                      │    │
│  │  ┌──────────────────────────────────────────┐    │    │
│  │  │  Order Processing                        │    │    │
│  │  │  - Validate order                        │    │    │
│  │  │  - Check wallet balance                  │    │    │
│  │  │  - Create order & items                  │    │    │
│  │  │  - Deduct wallet                         │    │    │
│  │  │  - Create transaction                    │    │    │
│  │  └──────────────────────────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────┐    │    │
│  │  │  Smart Queue Calculation                 │    │    │
│  │  │  - Count pending/preparing orders        │    │    │
│  │  │  - Calculate estimated time              │    │    │
│  │  └──────────────────────────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────┐    │    │
│  │  │  Analytics Engine                        │    │    │
│  │  │  - Daily statistics                      │    │    │
│  │  │  - Revenue calculation                   │    │    │
│  │  │  - Best selling items                    │    │    │
│  │  └──────────────────────────────────────────┘    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Student Order Flow

```
┌─────────┐
│ Student │
└────┬────┘
     │ 1. Login
     ▼
┌─────────────┐
│ JWT Token   │
│  Generated  │
└────┬────────┘
     │ 2. View Food Courts
     ▼
┌─────────────────────┐
│ Get Food Courts     │
│ + Estimated Time    │◄─── Smart Queue Calculation
└────┬────────────────┘
     │ 3. Select Food Court
     ▼
┌─────────────────────┐
│ Get Menu Items      │
└────┬────────────────┘
     │ 4. Add to Cart
     ▼
┌─────────────────────┐
│ Place Order         │
└────┬────────────────┘
     │ 5. Validate
     ▼
┌─────────────────────┐     ┌──────────────┐
│ Check Wallet        │────►│ Sufficient?  │
│ Balance             │     └──────┬───────┘
└─────────────────────┘            │ Yes
                                   ▼
                          ┌─────────────────┐
                          │ Create Order    │
                          └────┬────────────┘
                               │
                          ┌────▼────────────┐
                          │ Deduct Wallet   │
                          └────┬────────────┘
                               │
                          ┌────▼────────────┐
                          │ Create          │
                          │ Transaction     │
                          └────┬────────────┘
                               │
                          ┌────▼────────────┐
                          │ Return Order    │
                          │ Details         │
                          └─────────────────┘
```

### 2. Admin Order Management Flow

```
┌──────────────┐
│ Food Court   │
│    Admin     │
└──────┬───────┘
       │ 1. Login
       ▼
┌──────────────┐
│ JWT Token    │
└──────┬───────┘
       │ 2. View Orders
       ▼
┌──────────────────────┐
│ Get All Orders       │
│ for Food Court       │
└──────┬───────────────┘
       │ 3. Select Order
       ▼
┌──────────────────────┐
│ Update Status        │
│ pending → preparing  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Update Status        │
│ preparing → ready    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Update Status        │
│ ready → completed    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Order Completed      │
└──────────────────────┘
```

### 3. Smart Queue Calculation

```
┌─────────────────────┐
│ Get Food Court      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Count Orders with   │
│ status = pending    │
│ OR preparing        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Get Food Court      │
│ - avg_prep_time     │
│ - active_staff      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Calculate:          │
│ (orders × avg_time) │
│ ÷ active_staff      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Return Estimated    │
│ Waiting Time        │
└─────────────────────┘
```

## Database Schema Relationships

```
┌──────────────────┐
│      User        │
│──────────────────│
│ id (PK)          │
│ username         │
│ role             │
│ wallet_balance   │
│ is_blocked       │
└────┬─────────────┘
     │
     │ 1:N (admin)
     ▼
┌──────────────────┐
│   FoodCourt      │
│──────────────────│
│ id (PK)          │
│ name             │
│ admin_id (FK)    │
│ is_open          │
│ avg_prep_time    │
│ active_staff     │
└────┬─────────────┘
     │
     │ 1:N
     ▼
┌──────────────────┐
│   MenuItem       │
│──────────────────│
│ id (PK)          │
│ food_court_id(FK)│
│ name             │
│ price            │
│ is_available     │
└──────────────────┘

┌──────────────────┐
│      User        │
│ (Student)        │
└────┬─────────────┘
     │
     │ 1:N (student)
     ▼
┌──────────────────┐
│     Order        │
│──────────────────│
│ id (PK)          │
│ student_id (FK)  │
│ food_court_id(FK)│
│ status           │
│ total_amount     │
└────┬─────────────┘
     │
     │ 1:N
     ▼
┌──────────────────┐
│   OrderItem      │
│──────────────────│
│ id (PK)          │
│ order_id (FK)    │
│ menu_item_id(FK) │
│ quantity         │
│ price            │
└──────────────────┘

┌──────────────────┐
│      User        │
└────┬─────────────┘
     │
     │ 1:N
     ▼
┌──────────────────┐
│ WalletTransaction│
│──────────────────│
│ id (PK)          │
│ user_id (FK)     │
│ type             │
│ amount           │
│ order_id (FK)    │
│ balance_after    │
└──────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: HTTPS/TLS                                        │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Encrypted communication                         │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  Layer 2: CORS                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Allowed origins validation                      │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  Layer 3: JWT Authentication                               │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Token validation & expiration                   │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  Layer 4: Role-Based Permissions                           │
│  ┌──────────────────────────────────────────────────┐     │
│  │  IsStudent, IsFoodCourtAdmin, IsSuperAdmin       │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  Layer 5: Input Validation                                 │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Serializer validation                           │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  Layer 6: Database Security                                │
│  ┌──────────────────────────────────────────────────┐     │
│  │  ORM (prevents SQL injection)                    │     │
│  │  Password hashing                                │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────┐
│                      Internet                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Load Balancer                              │
│                  (AWS ELB / Nginx)                          │
└────────────┬────────────────────┬───────────────────────────┘
             │                    │
             ▼                    ▼
┌─────────────────────┐  ┌─────────────────────┐
│   Web Server 1      │  │   Web Server 2      │
│   (Gunicorn)        │  │   (Gunicorn)        │
│   Django App        │  │   Django App        │
└──────────┬──────────┘  └──────────┬──────────┘
           │                        │
           └────────────┬───────────┘
                        │
                        ▼
           ┌────────────────────────┐
           │   Database Server      │
           │   (PostgreSQL)         │
           │   - Master             │
           │   - Read Replicas      │
           └────────────────────────┘
                        │
                        ▼
           ┌────────────────────────┐
           │   Cache Layer          │
           │   (Redis)              │
           └────────────────────────┘
                        │
                        ▼
           ┌────────────────────────┐
           │   Static Files         │
           │   (S3 / CDN)           │
           └────────────────────────┘
```

## API Request Flow

```
1. Client Request
   │
   ▼
2. CORS Middleware
   │
   ▼
3. JWT Authentication
   │
   ▼
4. Permission Check
   │
   ▼
5. URL Routing
   │
   ▼
6. View Function
   │
   ├─► Serializer Validation
   │
   ├─► Business Logic
   │   │
   │   ├─► Model Operations
   │   │
   │   └─► Database Queries
   │
   ▼
7. Response Serialization
   │
   ▼
8. JSON Response
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend Stack                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Framework:        Django 6.0.2                            │
│  API:              Django REST Framework 3.15.2            │
│  Authentication:   JWT (djangorestframework-simplejwt)     │
│  CORS:             django-cors-headers                     │
│  Database:         SQLite (Dev) / PostgreSQL (Prod)        │
│  Server:           Gunicorn (Prod)                         │
│  Web Server:       Nginx (Prod)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                  Horizontal Scaling                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Multiple Application Servers                           │
│     - Load balanced Django instances                       │
│     - Stateless design (JWT tokens)                        │
│                                                             │
│  2. Database Scaling                                       │
│     - Read replicas for queries                            │
│     - Write to master                                      │
│     - Connection pooling                                   │
│                                                             │
│  3. Caching Layer                                          │
│     - Redis for session/data caching                       │
│     - Cache food courts & menu items                       │
│                                                             │
│  4. CDN for Static Files                                   │
│     - Serve static assets globally                         │
│                                                             │
│  5. Background Tasks                                       │
│     - Celery for async operations                          │
│     - Email/SMS notifications                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

This architecture supports:
- ✅ Role-based access control
- ✅ Secure authentication
- ✅ Scalable design
- ✅ Clean separation of concerns
- ✅ Easy maintenance
- ✅ Production-ready deployment
