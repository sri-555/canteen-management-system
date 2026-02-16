# 🚀 Render Deployment Guide - Complete Setup

## Overview
Deploy your Smart Canteen application on Render with PostgreSQL/MySQL database.

---

## 📋 Prerequisites
- GitHub account with your code pushed
- Render account (sign up at https://render.com)

---

## Step 1: Sign Up & Connect GitHub (2 minutes)

### 1.1 Create Render Account
1. Go to **https://render.com**
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub (recommended) or email
4. Authorize Render to access your GitHub repositories

---

## Step 2: Deploy Backend (Django API) (5 minutes)

### 2.1 Create New Web Service
1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `sri-555/canteen-management-system`
3. Configure the service:

**Basic Settings:**
- **Name**: `canteen-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend_pro/canteen`
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  gunicorn canteen.wsgi:application
  ```

### 2.2 Choose Plan
- **Free Plan**: Good for testing (sleeps after inactivity)
- **Starter Plan ($7/month)**: Recommended for production (always on)

### 2.3 Add Environment Variables
Click "Advanced" → "Add Environment Variable" and add these:

```env
PYTHON_VERSION=3.11.0
DEBUG=False
SECRET_KEY=#78j6)y_5*+qd&udr4l5$@3%4tx)n0ufq7x6^9nz5muc1gckq^
ALLOWED_HOSTS=.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
DATABASE_URL=postgresql://user:pass@host/dbname
```

**Note**: We'll update DATABASE_URL after creating the database.

### 2.4 Create Service
Click **"Create Web Service"** - Render will start building your app.

---

## Step 3: Add Database (3 minutes)

### 3.1 Create PostgreSQL Database
1. From Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `canteen-db`
   - **Database**: `canteen`
   - **User**: `canteen_user`
   - **Region**: Same as your web service
   - **Plan**: Free or Starter

3. Click **"Create Database"**

### 3.2 Get Database Connection String
1. Go to your database dashboard
2. Scroll to "Connections"
3. Copy the **"Internal Database URL"** (starts with `postgresql://`)

### 3.3 Update Backend Environment Variables
1. Go back to your web service
2. Go to "Environment" tab
3. Update `DATABASE_URL` with the copied connection string
4. Click "Save Changes"

**Your service will automatically redeploy.**

---

## Step 4: Run Database Migrations (2 minutes)

### 4.1 Access Shell
1. In your web service dashboard, go to "Shell" tab
2. Click "Launch Shell"

### 4.2 Run Commands
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Follow prompts to create admin account

# Or create via Python shell
python manage.py shell
```

In Python shell:
```python
from myapp.models import User
User.objects.create_superuser(
    username='superadmin',
    email='admin@example.com',
    password='YourSecurePassword123',
    role='super_admin'
)
exit()
```

---

## Step 5: Deploy Frontend on Vercel (3 minutes)

### 5.1 Sign Up & Import
1. Go to **https://vercel.com**
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repository

### 5.2 Configure Build
- **Framework Preset**: Vite
- **Root Directory**: `front _end`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 5.3 Add Environment Variable
```env
VITE_API_URL=https://canteen-backend.onrender.com/api
```
(Replace with your actual Render backend URL)

### 5.4 Deploy
Click "Deploy" and wait for build to complete.

---

## Step 6: Update CORS Settings (1 minute)

### 6.1 Get Your Vercel URL
After deployment, copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### 6.2 Update Backend Environment
1. Go to Render backend service
2. Environment tab
3. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://your-actual-app.vercel.app
   ```
4. Save (will trigger redeploy)

---

## 🎉 Your App is Live!

**Backend URL**: https://canteen-backend.onrender.com
**Frontend URL**: https://your-app.vercel.app

---

## 📝 Post-Deployment Tasks

### Initialize Sample Data (Optional)
In Render Shell:
```bash
python manage.py shell
```

```python
from myapp.models import User, FoodCourt

# Create food court admins
admin1 = User.objects.create_user(
    username='admin1',
    email='admin1@canteen.com',
    password='admin123',
    first_name='Admin',
    last_name='One',
    role='food_court_admin'
)

# Create food courts
FoodCourt.objects.create(
    name='Food Court 1',
    description='Main cafeteria',
    admin=admin1,
    is_open=True
)
```

### Set Up Custom Domain (Optional)
**Render:**
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

**Vercel:**
1. Settings → Domains
2. Add your domain
3. Configure DNS

---

## 🔧 Render-Specific Configuration

### Create render.yaml (Optional - for Infrastructure as Code)
Create `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: canteen-backend
    env: python
    region: oregon
    plan: starter
    buildCommand: pip install -r backend_pro/requirements.txt
    startCommand: cd backend_pro/canteen && gunicorn canteen.wsgi:application
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: DEBUG
        value: False
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: canteen-db
          property: connectionString

databases:
  - name: canteen-db
    plan: starter
    region: oregon
```

---

## 💰 Pricing

### Render Pricing:
- **Free Tier**: 
  - Web Service: Sleeps after 15 min inactivity
  - PostgreSQL: 90 days free, then $7/month
  
- **Starter Tier**: 
  - Web Service: $7/month (always on)
  - PostgreSQL: $7/month

### Vercel:
- **Free**: Unlimited for personal projects
- **Pro**: $20/month (for teams)

**Total Cost**: $0-14/month depending on plan

---

## 🔍 Monitoring & Logs

### View Logs
1. Go to your service dashboard
2. Click "Logs" tab
3. View real-time logs

### Metrics
- CPU usage
- Memory usage
- Request count
- Response times

---

## 🆘 Troubleshooting

### Backend Won't Start
**Check:**
1. Build logs for errors
2. Environment variables are set correctly
3. Database connection string is valid
4. `gunicorn` is in requirements.txt

**Common Issues:**
```bash
# If you see "No module named 'canteen'"
# Make sure Root Directory is set to: backend_pro/canteen

# If database connection fails
# Verify DATABASE_URL is the Internal Database URL
```

### Frontend Can't Connect to Backend
**Check:**
1. `VITE_API_URL` points to correct Render URL
2. CORS settings include your Vercel domain
3. Backend is running (not sleeping on free tier)

### Database Migration Errors
```bash
# In Render Shell
python manage.py showmigrations
python manage.py migrate --fake-initial
```

---

## 🚀 Deployment Checklist

- [ ] Backend deployed on Render
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Superuser created
- [ ] Frontend deployed on Vercel
- [ ] CORS settings updated
- [ ] Test login functionality
- [ ] Test all features
- [ ] Custom domain configured (optional)

---

## 📚 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your GitHub Repo**: https://github.com/sri-555/canteen-management-system

---

## 🎯 Quick Links for Deployment

**Start Here:**
1. **Render Sign Up**: https://dashboard.render.com/register
2. **Create Web Service**: https://dashboard.render.com/create?type=web
3. **Create Database**: https://dashboard.render.com/create?type=pgsql
4. **Vercel Deploy**: https://vercel.com/new

---

## 💡 Pro Tips

1. **Use Starter Plan** for production to avoid sleep delays
2. **Enable Auto-Deploy** from GitHub for automatic updates
3. **Set up Health Checks** in Render settings
4. **Use Environment Groups** for shared variables
5. **Enable Notifications** for deployment status

---

## Need Help?

- Render Community: https://community.render.com
- Render Support: support@render.com
- Check deployment logs for detailed error messages
