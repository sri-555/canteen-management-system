# 🚀 Quick Reference Card

## Start Servers

### Backend
```bash
cd backend_pro/canteen
python manage.py runserver
```
→ http://localhost:8000

### Frontend
```bash
cd "front _end"
npm run dev
```
→ http://localhost:5173

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Student | `student1` | `student123` |
| Admin | `cafeteria_admin` | `admin123` |
| Super Admin | `superadmin` | `admin123` |

## API Service Import

```typescript
import api from '../../services/api';
```

## Common API Calls

### Student
```typescript
// Food courts
const courts = await api.student.getFoodCourts();
const menu = await api.student.getFoodCourtMenu(1);

// Orders
const order = await api.student.placeOrder({
  food_court: 1,
  items: [{ menu_item_id: 1, quantity: 2 }]
});
const orders = await api.student.getOrders();

// Wallet
const { balance } = await api.student.getWalletBalance();
await api.student.addWalletBalance(500);
const txns = await api.student.getWalletTransactions();
```

### Admin
```typescript
// Food court
const court = await api.admin.getFoodCourt();
await api.admin.updateFoodCourt({ is_open: true });

// Menu
const items = await api.admin.getMenuItems();
await api.admin.addMenuItem(data);
await api.admin.updateMenuItem(id, data);
await api.admin.deleteMenuItem(id);

// Orders
const orders = await api.admin.getOrders();
await api.admin.updateOrderStatus(1, 'preparing');

// Analytics
const stats = await api.admin.getAnalytics();
```

### Super Admin
```typescript
// Food courts
const courts = await api.superAdmin.getAllFoodCourts();
await api.superAdmin.createFoodCourt(data);

// Users
const users = await api.superAdmin.getAllUsers();
await api.superAdmin.blockUser(5, true);

// Analytics
const stats = await api.superAdmin.getSystemAnalytics();
```

## Error Handling

```typescript
try {
  const data = await api.student.getFoodCourts();
  // Success
} catch (error: any) {
  console.error(error.message);
  // Show error to user
}
```

## Loading Pattern

```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await api.student.getFoodCourts();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

## File Locations

| What | Where |
|------|-------|
| API Service | `front _end/src/services/api.ts` |
| Types | `front _end/src/types/index.ts` |
| Auth Context | `front _end/src/context/AuthContext.tsx` |
| Cart Context | `front _end/src/context/CartContext.tsx` |
| Backend Models | `backend_pro/canteen/myapp/models.py` |
| Backend Views | `backend_pro/canteen/myapp/views.py` |
| Backend URLs | `backend_pro/canteen/myapp/urls.py` |

## Useful Commands

### Backend
```bash
# Migrations
python manage.py makemigrations
python manage.py migrate

# Create sample data
python create_sample_data.py

# Create superuser
python manage.py createsuperuser

# Django shell
python manage.py shell

# Run tests
python manage.py test
```

### Frontend
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## Debugging

### Check Backend
```bash
curl http://localhost:8000/api/
```

### Check Frontend API Calls
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Watch API calls

### Check Tokens
1. Open DevTools (F12)
2. Go to Application tab
3. Local Storage → http://localhost:5173
4. See `access_token`, `refresh_token`

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Check backend is running |
| 401 Unauthorized | Token expired, logout and login |
| Port in use | Change port or kill process |
| Module not found | Run `npm install` |
| Database error | Run migrations |

## Documentation

| Doc | Purpose |
|-----|---------|
| README.md | Project overview |
| INTEGRATION_GUIDE.md | Integration details |
| INTEGRATION_SUMMARY.md | Quick summary |
| START_SERVERS.md | Server startup |
| backend_pro/README.md | API documentation |
| backend_pro/TESTING_GUIDE.md | Testing |
| backend_pro/DEPLOYMENT.md | Deployment |

## Sample Data

- 1 Super Admin
- 2 Food Court Admins
- 5 Students (₹500 each)
- 2 Food Courts
- 16 Menu Items
- 2 Sample Orders

## API Endpoints Count

- Authentication: 4 endpoints
- Student: 8 endpoints
- Admin: 9 endpoints
- Super Admin: 6 endpoints
- **Total: 27+ endpoints**

## Smart Queue Formula

```
Estimated Time = (Pending Orders × Avg Prep Time) / Active Staff
```

## Order Status Flow

```
pending → preparing → ready → completed
```

## Wallet Transaction Types

- `credit` - Money added
- `debit` - Money spent

## Roles

- `student` - Can order food
- `food_court_admin` - Manages one food court
- `super_admin` - Manages entire system

## Quick Test

1. Start both servers
2. Open http://localhost:5173
3. Login as student1/student123
4. Should see dashboard
5. Check Network tab for API calls
6. Check Local Storage for tokens

## Need Help?

1. Check INTEGRATION_GUIDE.md
2. Check backend_pro/README.md
3. Check browser console
4. Check Network tab
5. Check backend terminal logs

---

**Keep this handy while developing!** 📌
