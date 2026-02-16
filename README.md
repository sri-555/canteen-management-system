# 🍽️ Canteen Management System

A complete full-stack canteen management system with role-based access control, smart queue prediction, and real-time order tracking.

## 🎯 Features

### 👨‍🎓 Student Features
- Browse food courts with real-time estimated waiting time
- View menus and add items to cart
- Place orders using wallet balance
- Track order status (Pending → Preparing → Ready → Completed)
- Manage wallet (view balance, add money, transaction history)

### 🧑‍🍳 Food Court Admin Features
- Manage menu items (Add/Edit/Delete)
- Update food court settings (open/close, staff count, prep time)
- View and manage incoming orders
- Update order status
- View daily analytics (orders, revenue, best-selling items)

### 🏫 Super Admin Features
- Manage all food courts
- Create food court admins
- View and manage all users (block/unblock)
- System-wide analytics and revenue tracking

### 🧠 Smart Queue Prediction
Dynamic estimated waiting time calculation:
```
Estimated Time = (Pending Orders × Avg Prep Time) / Active Staff Count
```

## 🏗️ Tech Stack

### Backend
- **Framework:** Django 6.0.2
- **API:** Django REST Framework 3.15.2
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Database:** SQLite (dev) / PostgreSQL (production)
- **CORS:** django-cors-headers

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.2.0
- **Routing:** React Router DOM 6.26.2
- **Styling:** Tailwind CSS 3.4.17
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 📁 Project Structure

```
canteen_management/
├── backend_pro/              # Django Backend
│   ├── canteen/             # Django project
│   │   ├── canteen/         # Settings & config
│   │   ├── myapp/           # Main app
│   │   │   ├── models.py    # Database models
│   │   │   ├── views.py     # API endpoints
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── permissions.py
│   │   ├── db.sqlite3       # Database
│   │   └── manage.py
│   ├── requirements.txt
│   └── README.md            # Backend docs
│
├── front _end/              # React Frontend
│   ├── src/
│   │   ├── services/        # API service layer
│   │   ├── context/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── .env                 # Environment config
│
├── INTEGRATION_GUIDE.md     # Integration documentation
├── START_SERVERS.md         # Quick start guide
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend
cd backend_pro

# Install dependencies
pip install -r requirements.txt

# Navigate to Django project
cd canteen

# Run migrations
python manage.py migrate

# Create sample data
python create_sample_data.py

# Start backend server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend
cd "front _end"

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Login

Open `http://localhost:5173` and login with:

**Student:**
- Username: `student1`
- Password: `student123`

**Food Court Admin:**
- Username: `cafeteria_admin`
- Password: `admin123`

**Super Admin:**
- Username: `superadmin`
- Password: `admin123`

## 📚 Documentation

- **[Backend API Documentation](backend_pro/README.md)** - Complete API reference with examples
- **[Integration Guide](INTEGRATION_GUIDE.md)** - Frontend-Backend integration details
- **[Quick Start Guide](START_SERVERS.md)** - How to run both servers
- **[Deployment Guide](backend_pro/DEPLOYMENT.md)** - Production deployment instructions
- **[Testing Guide](backend_pro/TESTING_GUIDE.md)** - API testing scenarios
- **[Architecture](backend_pro/ARCHITECTURE.md)** - System architecture diagrams
- **[Folder Structure](backend_pro/FOLDER_STRUCTURE.md)** - Detailed file structure

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login with JWT
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/profile/` - Get user profile

### Student (8 endpoints)
- `GET /api/food-courts/` - List food courts
- `GET /api/food-courts/{id}/` - Food court menu
- `POST /api/student/orders/place/` - Place order
- `GET /api/student/orders/` - My orders
- `GET /api/student/wallet/balance/` - Wallet balance
- `POST /api/student/wallet/add/` - Add money
- `GET /api/student/wallet/transactions/` - Transaction history

### Food Court Admin (9 endpoints)
- `GET /api/admin/food-court/` - My food court
- `PATCH /api/admin/food-court/update/` - Update settings
- `GET /api/admin/menu-items/` - List menu items
- `POST /api/admin/menu-items/` - Add menu item
- `PATCH /api/admin/menu-items/{id}/` - Update item
- `DELETE /api/admin/menu-items/{id}/` - Delete item
- `GET /api/admin/orders/` - All orders
- `PATCH /api/admin/orders/{id}/status/` - Update status
- `GET /api/admin/analytics/` - Daily analytics

### Super Admin (6 endpoints)
- `GET /api/superadmin/food-courts/` - All food courts
- `POST /api/superadmin/food-courts/create/` - Create food court
- `POST /api/superadmin/admins/create/` - Create admin
- `GET /api/superadmin/users/` - All users
- `PATCH /api/superadmin/users/{id}/block/` - Block user
- `GET /api/superadmin/analytics/` - System analytics

## 🗄️ Database Models

- **User** - Custom user with role, wallet_balance, is_blocked
- **FoodCourt** - Food court with admin, settings, smart queue
- **MenuItem** - Menu items with price, availability
- **Order** - Orders with status tracking
- **OrderItem** - Order line items
- **WalletTransaction** - Complete transaction history

## 🔐 Security Features

- JWT authentication with access & refresh tokens
- Role-based access control (RBAC)
- Password hashing
- CORS configuration
- Blocked user prevention
- Atomic wallet transactions
- Input validation

## 📊 Sample Data

The system comes with pre-populated sample data:
- 1 Super Admin
- 2 Food Court Admins
- 5 Students (₹500 wallet balance each)
- 2 Food Courts (Main Cafeteria, North Campus Canteen)
- 16 Menu Items across various categories
- 2 Sample Orders

## 🧪 Testing

### API Testing
Use the provided Postman collection:
```bash
Import: backend_pro/Canteen_API.postman_collection.json
```

Or use curl commands from:
```bash
backend_pro/API_EXAMPLES.http
```

### Manual Testing
See `backend_pro/TESTING_GUIDE.md` for complete testing scenarios.

## 🔄 Integration Status

### ✅ Completed
- Backend API (40+ endpoints)
- Frontend API service layer
- Authentication flow
- Type definitions
- JWT token management
- CORS configuration

### 🔄 In Progress
Individual pages need to be updated to use real API instead of mock data:
- Student pages (Home, Menu, Orders, Wallet)
- Admin pages (Dashboard, Menu Management, Order Queue)
- Super Admin pages (Revenue, Food Courts, Users)

See `INTEGRATION_GUIDE.md` for detailed instructions.

## 🚢 Deployment

### Backend Deployment
See `backend_pro/DEPLOYMENT.md` for:
- Heroku deployment
- AWS EC2 deployment
- DigitalOcean deployment
- Docker deployment

### Frontend Deployment
```bash
cd "front _end"
npm run build
# Deploy dist/ folder to Netlify, Vercel, or any static host
```

## 🛠️ Development

### Backend Development
```bash
cd backend_pro/canteen
python manage.py runserver
```

### Frontend Development
```bash
cd "front _end"
npm run dev
```

### Run Both Servers
See `START_SERVERS.md` for scripts to run both servers simultaneously.

## 📝 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes.

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 in use:** Change port with `python manage.py runserver 8001`
- **Database errors:** Run `python manage.py migrate`
- **No sample data:** Run `python create_sample_data.py`

### Frontend Issues
- **Dependencies missing:** Run `npm install`
- **Port 5173 in use:** Vite will auto-assign another port
- **API errors:** Check backend is running and `.env` is configured

### CORS Issues
- Ensure backend is running
- Check `CORS_ALLOW_ALL_ORIGINS = True` in Django settings
- Verify API URL in frontend `.env`

## 📞 Support

For issues or questions:
1. Check documentation in respective folders
2. Review `INTEGRATION_GUIDE.md`
3. Check `backend_pro/TESTING_GUIDE.md`
4. Review browser console and network tab

## 🎉 Features Highlights

- ✅ Complete role-based access control
- ✅ Real-time smart queue prediction
- ✅ Wallet management with transaction history
- ✅ Order tracking with status updates
- ✅ Analytics for admins
- ✅ JWT authentication
- ✅ Responsive design
- ✅ Type-safe API integration
- ✅ Comprehensive documentation
- ✅ Sample data for testing

## 🚀 Next Steps

1. ✅ Backend API complete
2. ✅ Frontend structure complete
3. ✅ Integration layer complete
4. 🔄 Update pages to use real API
5. 🔄 Add loading states
6. 🔄 Add error handling UI
7. 🔄 Add notifications
8. 🔄 Deploy to production

---

**Built with ❤️ for efficient canteen management**
