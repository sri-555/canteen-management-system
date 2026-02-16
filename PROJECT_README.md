# Canteen Management System

A full-stack web application for managing college/university canteen operations with separate interfaces for students, food court admins, and super admins.

## 🚀 Features

### For Students
- Browse multiple food courts and their menus
- Filter menu items by category
- Add items to cart and place orders
- Real-time order tracking
- Digital wallet management
- Transaction history
- User registration and authentication

### For Food Court Admins
- Manage menu items (add, edit, delete)
- Upload/update food images
- Update food court status (open/closed)
- View and manage orders
- Update order status
- View analytics and reports
- Receive email notifications for new orders

### For Super Admins
- Manage all food courts
- Assign/reassign food court admins
- View system-wide analytics
- Manage users
- Block/unblock users

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 6.0.2
- **API**: Django REST Framework
- **Authentication**: JWT (Simple JWT)
- **Database**: MySQL
- **Email**: SMTP (Gmail)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📋 Prerequisites

- Python 3.12+
- Node.js 18+
- MySQL 8.0+
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd canteen_management
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend_pro/canteen

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure MySQL database
# Update settings.py with your MySQL credentials

# Run migrations
python manage.py migrate

# Create sample data
python populate_food_courts.py
python create_users.py

# Start backend server
python manage.py runserver
```

Backend will run on: http://127.0.0.1:8000/

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd front_end

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173/

## 🗄️ Database Configuration

Update `backend_pro/canteen/canteen/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'canteen',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

## 🔐 Default Login Credentials

### Super Admin
- Username: `superadmin`
- Password: `super123`

### Food Court Admins
- Username: `foodcourt1_admin` (or 2, 3, 4, 5)
- Password: `admin123`

### Students
- Username: `student1`
- Password: `student123`

Or register a new student account!

## 📧 Email Notification Setup

To enable email notifications for new orders:

1. Generate Gmail App Password
2. Update `settings.py`:
```python
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

See `EMAIL_NOTIFICATION_SETUP.md` for detailed instructions.

## 📁 Project Structure

```
canteen_management/
├── backend_pro/
│   └── canteen/
│       ├── canteen/          # Django project settings
│       ├── myapp/            # Main application
│       │   ├── models.py     # Database models
│       │   ├── views.py      # API endpoints
│       │   ├── serializers.py
│       │   └── urls.py
│       ├── manage.py
│       └── requirements.txt
├── front_end/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context
│   │   ├── pages/            # Page components
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   ├── superadmin/
│   │   │   └── auth/
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🎯 Key Features Implementation

### Order Management
- Students can place orders from multiple food courts
- Real-time order status updates
- Wallet-based payment system

### Menu Management
- Food court admins can manage their menu
- Image upload support (file or URL)
- Category-based organization

### User Management
- Role-based access control
- JWT authentication
- User registration with email validation

### Analytics
- Food court performance metrics
- Revenue tracking
- Popular items analysis

## 🔒 Security Features

- Password hashing
- JWT token authentication
- CORS configuration
- SQL injection protection
- XSS protection
- Role-based permissions

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings.py
2. Configure `ALLOWED_HOSTS`
3. Set up production database
4. Configure static files
5. Use production WSGI server (Gunicorn)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy `dist` folder to hosting service
3. Update API base URL in production

## 📝 API Documentation

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `GET /api/auth/profile/` - Get user profile

### Student Endpoints
- `GET /api/food-courts/` - List all food courts
- `GET /api/food-courts/{id}/` - Get food court details
- `POST /api/student/orders/place/` - Place order
- `GET /api/student/orders/` - Get user orders
- `GET /api/student/wallet/balance/` - Get wallet balance
- `POST /api/student/wallet/add/` - Add money to wallet

### Admin Endpoints
- `GET /api/admin/menu-items/` - List menu items
- `POST /api/admin/menu-items/` - Create menu item
- `PATCH /api/admin/menu-items/{id}/` - Update menu item
- `DELETE /api/admin/menu-items/{id}/` - Delete menu item
- `GET /api/admin/orders/` - List orders
- `PATCH /api/admin/orders/{id}/status/` - Update order status

## 🐛 Troubleshooting

### Backend Issues
- **Database connection error**: Check MySQL credentials
- **Migration errors**: Run `python manage.py migrate`
- **Import errors**: Ensure all dependencies are installed

### Frontend Issues
- **API connection error**: Check backend is running
- **Build errors**: Clear node_modules and reinstall
- **CORS errors**: Check CORS settings in Django

## 📄 License

This project is for educational purposes.

## 👥 Contributors

- Your Name

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🎓 Acknowledgments

Built as a college canteen management solution.
