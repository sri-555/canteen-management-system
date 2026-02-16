# Frontend-Backend Integration Guide

## ✅ Integration Complete!

The React frontend has been successfully connected to the Django backend API.

## Changes Made

### 1. API Service Layer (`front _end/src/services/api.ts`)
Created a comprehensive API service with:
- JWT token management (access & refresh tokens)
- Automatic token refresh on 401 errors
- Type-safe API calls
- Error handling
- All endpoints for Student, Admin, and Super Admin

### 2. Updated Type Definitions (`front _end/src/types/index.ts`)
- Updated `User` interface to match backend response
- Changed role types: `'student' | 'food_court_admin' | 'super_admin'`
- Added `MenuItem`, `Order`, `OrderItem`, `Transaction` interfaces
- Added `AdminAnalytics` and `SystemAnalytics` types
- Updated all types to match Django API responses

### 3. Updated AuthContext (`front _end/src/context/AuthContext.tsx`)
- Integrated real API calls for login/register
- JWT token storage and management
- Automatic user profile loading on app start
- Token refresh handling
- Added `refreshUser()` method

### 4. Updated CartContext (`front _end/src/context/CartContext.tsx`)
- Updated to work with `MenuItem` instead of `Product`
- Added food court validation (prevent mixing items from different courts)
- Updated price calculations to work with string prices

### 5. Updated LoginPage (`front _end/src/pages/auth/LoginPage.tsx`)
- Removed role selector (role determined by backend)
- Changed from email to username login
- Updated demo credentials
- Better error handling

### 6. Updated App.tsx
- Fixed role names in protected routes
- Updated cart drawer to work with new data structure
- Changed currency from $ to ₹

### 7. Environment Configuration
- Created `.env` and `.env.example` files
- Configured `VITE_API_URL` for API base URL

## Setup Instructions

### 1. Start Backend Server

```bash
cd backend_pro/canteen
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

### 2. Install Frontend Dependencies

```bash
cd front _end
npm install
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173` (or another port if 5173 is busy)

### 4. Test the Integration

1. **Login as Student:**
   - Username: `student1`
   - Password: `student123`
   - Should redirect to `/student`

2. **Login as Food Court Admin:**
   - Username: `cafeteria_admin`
   - Password: `admin123`
   - Should redirect to `/admin`

3. **Login as Super Admin:**
   - Username: `superadmin`
   - Password: `admin123`
   - Should redirect to `/super-admin`

## API Integration Status

### ✅ Completed Integrations

#### Authentication
- ✅ Login with JWT tokens
- ✅ Register new users
- ✅ Get user profile
- ✅ Token refresh
- ✅ Logout

#### Student Features
- ✅ API service methods created
- ✅ Get food courts with estimated waiting time
- ✅ Get food court menu
- ✅ Place order
- ✅ Get orders
- ✅ Get wallet balance
- ✅ Add wallet balance
- ✅ Get transaction history

#### Food Court Admin Features
- ✅ API service methods created
- ✅ Get assigned food court
- ✅ Update food court settings
- ✅ Get menu items
- ✅ Add/Update/Delete menu items
- ✅ Get orders
- ✅ Update order status
- ✅ Get analytics

#### Super Admin Features
- ✅ API service methods created
- ✅ Get all food courts
- ✅ Create food court
- ✅ Create food court admin
- ✅ Get all users
- ✅ Block/unblock users
- ✅ Get system analytics

### 🔄 Pages That Need Updates

The following pages still use mock data and need to be updated to use the API service:

#### Student Pages
1. **`StudentHome.tsx`** - Update to fetch real food courts
2. **`FoodCourtMenu.tsx`** - Update to fetch real menu items and place orders
3. **`OrderTracker.tsx`** - Update to fetch real orders
4. **`Wallet.tsx`** - Update to fetch real wallet data

#### Admin Pages
5. **`AdminDashboard.tsx`** - Update to fetch real analytics
6. **`MenuManagement.tsx`** - Update to use real menu CRUD operations
7. **`OrderQueue.tsx`** - Update to fetch and update real orders

#### Super Admin Pages
8. **`RevenueDashboard.tsx`** - Update to fetch real system analytics
9. **`FoodCourtManagement.tsx`** - Update to manage real food courts
10. **`UserManagement.tsx`** - Update to manage real users

#### Other Components
11. **`RegisterPage.tsx`** - Update to use real registration API
12. **`DashboardLayout.tsx`** - Update user display to use real user data

## How to Update Pages

### Example: Updating StudentHome.tsx

**Before (Mock Data):**
```typescript
import { FOOD_COURTS } from '../../lib/mockData';

export function StudentHome() {
  const foodCourts = FOOD_COURTS;
  // ...
}
```

**After (Real API):**
```typescript
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FoodCourt } from '../../types';

export function StudentHome() {
  const [foodCourts, setFoodCourts] = useState<FoodCourt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoodCourts = async () => {
      try {
        const data = await api.student.getFoodCourts();
        setFoodCourts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodCourts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // ... rest of component
}
```

### Example: Placing an Order

```typescript
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const { items, foodCourtId, clearCart } = useCart();

const handleCheckout = async () => {
  try {
    const orderData = {
      food_court: foodCourtId!,
      items: items.map(item => ({
        menu_item_id: item.menuItem.id,
        quantity: item.quantity
      }))
    };

    const order = await api.student.placeOrder(orderData);
    clearCart();
    // Show success message
    // Navigate to order tracker
  } catch (error: any) {
    // Show error message
    alert(error.message);
  }
};
```

### Example: Updating Order Status (Admin)

```typescript
import api from '../../services/api';

const handleStatusUpdate = async (orderId: number, newStatus: string) => {
  try {
    await api.admin.updateOrderStatus(orderId, newStatus);
    // Refresh orders list
    fetchOrders();
  } catch (error: any) {
    alert(error.message);
  }
};
```

## API Service Usage Examples

### Student APIs

```typescript
import api from './services/api';

// Get food courts
const foodCourts = await api.student.getFoodCourts();

// Get menu
const menu = await api.student.getFoodCourtMenu(1);

// Place order
const order = await api.student.placeOrder({
  food_court: 1,
  items: [
    { menu_item_id: 1, quantity: 2 },
    { menu_item_id: 3, quantity: 1 }
  ]
});

// Get wallet balance
const { balance } = await api.student.getWalletBalance();

// Add money
await api.student.addWalletBalance(500);

// Get transactions
const transactions = await api.student.getWalletTransactions();
```

### Admin APIs

```typescript
// Get food court
const foodCourt = await api.admin.getFoodCourt();

// Update settings
await api.admin.updateFoodCourt({
  is_open: true,
  active_staff_count: 5
});

// Add menu item
await api.admin.addMenuItem({
  name: 'New Dish',
  description: 'Delicious',
  price: '150.00',
  category: 'Main Course',
  is_available: true,
  food_court: 1
});

// Update order status
await api.admin.updateOrderStatus(1, 'preparing');

// Get analytics
const analytics = await api.admin.getAnalytics();
```

### Super Admin APIs

```typescript
// Get all food courts
const foodCourts = await api.superAdmin.getAllFoodCourts();

// Create food court
await api.superAdmin.createFoodCourt({
  name: 'New Canteen',
  description: 'Description',
  admin: 3,
  is_open: true,
  avg_preparation_time: 15,
  active_staff_count: 2
});

// Block user
await api.superAdmin.blockUser(5, true);

// Get analytics
const analytics = await api.superAdmin.getSystemAnalytics();
```

## Error Handling

The API service includes comprehensive error handling:

```typescript
try {
  const data = await api.student.getFoodCourts();
  // Success
} catch (error: any) {
  if (error instanceof APIError) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    console.log('Data:', error.data);
  }
}
```

## Token Management

Tokens are automatically managed:
- Access token stored in localStorage
- Refresh token stored in localStorage
- Automatic refresh on 401 errors
- Automatic logout on refresh failure

Manual token operations:
```typescript
import { tokenManager } from './services/api';

// Get tokens
const accessToken = tokenManager.getAccessToken();
const refreshToken = tokenManager.getRefreshToken();

// Clear tokens (logout)
tokenManager.clearTokens();
```

## CORS Configuration

The backend is already configured to allow CORS from all origins (development mode).

For production, update `backend_pro/canteen/canteen/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]
CORS_ALLOW_ALL_ORIGINS = False
```

## Testing the Integration

### 1. Test Authentication Flow
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"student123"}'

# Should return access and refresh tokens
```

### 2. Test Protected Endpoint
```bash
# Get food courts (requires authentication)
curl http://localhost:8000/api/food-courts/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Test in Browser
1. Open browser DevTools (F12)
2. Go to Network tab
3. Login to the app
4. Watch API calls being made
5. Check localStorage for tokens

## Troubleshooting

### Issue: CORS Errors
**Solution:** Make sure Django backend is running and CORS is configured

### Issue: 401 Unauthorized
**Solution:** Check if token is being sent in Authorization header

### Issue: Network Error
**Solution:** Verify backend is running on `http://localhost:8000`

### Issue: Token Expired
**Solution:** Token refresh should happen automatically. If not, logout and login again

### Issue: Type Errors
**Solution:** Make sure all types match between frontend and backend

## Next Steps

1. ✅ Backend API is complete and running
2. ✅ Frontend API service is created
3. ✅ Authentication is integrated
4. ✅ Types are updated
5. 🔄 Update individual pages to use real API (see list above)
6. 🔄 Add loading states
7. 🔄 Add error handling UI
8. 🔄 Add success notifications
9. 🔄 Test all features end-to-end

## File Structure

```
front _end/
├── src/
│   ├── services/
│   │   └── api.ts              ✅ NEW - API service layer
│   ├── types/
│   │   └── index.ts            ✅ UPDATED - Backend-compatible types
│   ├── context/
│   │   ├── AuthContext.tsx     ✅ UPDATED - Real API integration
│   │   └── CartContext.tsx     ✅ UPDATED - New data structure
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx   ✅ UPDATED - Username login
│   │   │   └── RegisterPage.tsx 🔄 TODO - Use real API
│   │   ├── student/
│   │   │   ├── StudentHome.tsx  🔄 TODO - Fetch real data
│   │   │   ├── FoodCourtMenu.tsx 🔄 TODO - Fetch real data
│   │   │   ├── OrderTracker.tsx 🔄 TODO - Fetch real data
│   │   │   └── Wallet.tsx       🔄 TODO - Fetch real data
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx 🔄 TODO - Fetch real data
│   │   │   ├── MenuManagement.tsx 🔄 TODO - Use real CRUD
│   │   │   └── OrderQueue.tsx    🔄 TODO - Fetch real data
│   │   └── superadmin/
│   │       ├── RevenueDashboard.tsx 🔄 TODO - Fetch real data
│   │       ├── FoodCourtManagement.tsx 🔄 TODO - Use real CRUD
│   │       └── UserManagement.tsx 🔄 TODO - Use real CRUD
│   └── App.tsx                 ✅ UPDATED - Fixed roles
├── .env                        ✅ NEW - API configuration
└── .env.example                ✅ NEW - Example config
```

## Summary

The integration foundation is complete! The API service layer is ready, authentication works, and all API endpoints are accessible. Now you can update individual pages to fetch and display real data from the Django backend.

Start with the StudentHome page to see food courts, then move to the menu and ordering flow. The API service makes it easy - just import `api` and call the appropriate methods!
