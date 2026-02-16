# Deployment & Hosting Guide for Smart Canteen Application

## Overview
This guide covers multiple deployment options for your full-stack canteen management system (Django backend + React frontend).

---

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) - RECOMMENDED
**Best for**: Quick deployment, free tier available, easy setup

#### Frontend (Vercel)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - Root Directory: `front _end`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```

#### Backend (Railway)
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Add MySQL database from Railway marketplace
4. Configure environment variables:
   ```
   DEBUG=False
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=your-app.railway.app
   DATABASE_URL=mysql://user:pass@host:port/dbname
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
5. Add `Procfile` in backend_pro/canteen/:
   ```
   web: gunicorn canteen.wsgi --log-file -
   ```

---

### Option 2: Netlify (Frontend) + Heroku (Backend)
**Best for**: Established platforms, good documentation

#### Frontend (Netlify)
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New site from Git
4. Build settings:
   - Base directory: `front _end`
   - Build command: `npm run build`
   - Publish directory: `front _end/dist`
5. Environment variables:
   ```
   VITE_API_URL=https://your-app.herokuapp.com/api
   ```

#### Backend (Heroku)
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add MySQL addon: `heroku addons:create jawsdb:kitefin`
4. Set environment variables:
   ```bash
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set ALLOWED_HOSTS=your-app.herokuapp.com
   ```
5. Deploy: `git push heroku main`

---

### Option 3: AWS (Full Stack)
**Best for**: Production, scalability, full control

#### Components:
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or Elastic Beanstalk
- **Database**: RDS MySQL
- **Static Files**: S3

#### Steps:
1. **Database (RDS)**:
   - Create MySQL RDS instance
   - Note connection details

2. **Backend (EC2)**:
   - Launch Ubuntu EC2 instance
   - Install Python, pip, nginx
   - Deploy Django app with gunicorn
   - Configure nginx as reverse proxy

3. **Frontend (S3 + CloudFront)**:
   - Build React app: `npm run build`
   - Upload to S3 bucket
   - Create CloudFront distribution
   - Point to S3 bucket

---

### Option 4: DigitalOcean App Platform
**Best for**: Simple full-stack deployment, affordable

1. Push code to GitHub
2. Create new app on DigitalOcean
3. Add two components:
   - **Web Service** (Backend): Python, auto-detect Django
   - **Static Site** (Frontend): Node.js, build command `npm run build`
4. Add MySQL database
5. Configure environment variables

---

### Option 5: Self-Hosted (VPS)
**Best for**: Full control, custom domain

#### Requirements:
- VPS (DigitalOcean, Linode, Vultr)
- Domain name (optional)

#### Setup:
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install dependencies
sudo apt install python3-pip python3-venv nginx mysql-server nodejs npm -y

# 3. Setup MySQL
sudo mysql_secure_installation
mysql -u root -p
CREATE DATABASE canteen_db;
CREATE USER 'canteen_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON canteen_db.* TO 'canteen_user'@'localhost';

# 4. Deploy Backend
cd /var/www
git clone your-repo
cd backend_pro/canteen
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# 5. Configure Django
python manage.py migrate
python manage.py collectstatic

# 6. Setup Gunicorn service
sudo nano /etc/systemd/system/canteen.service

# 7. Deploy Frontend
cd /var/www/front_end
npm install
npm run build

# 8. Configure Nginx
sudo nano /etc/nginx/sites-available/canteen
```

---

## 📋 Pre-Deployment Checklist

### Backend Preparation
- [ ] Set `DEBUG = False` in settings.py
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set strong `SECRET_KEY`
- [ ] Configure CORS settings
- [ ] Setup production database
- [ ] Collect static files
- [ ] Run migrations
- [ ] Create superuser
- [ ] Test all API endpoints

### Frontend Preparation
- [ ] Update API URL in environment variables
- [ ] Build production bundle
- [ ] Test build locally
- [ ] Optimize images
- [ ] Check console for errors

### Security
- [ ] Use HTTPS
- [ ] Secure database credentials
- [ ] Enable CSRF protection
- [ ] Configure secure cookies
- [ ] Set up firewall rules
- [ ] Regular backups

---

## 🔧 Configuration Files Needed

### 1. backend_pro/canteen/Procfile (for Railway/Heroku)
```
web: gunicorn canteen.wsgi --log-file -
release: python manage.py migrate
```

### 2. backend_pro/canteen/runtime.txt
```
python-3.11.0
```

### 3. backend_pro/canteen/.env.production
```
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=mysql://user:pass@host:port/dbname
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.com
```

### 4. front _end/.env.production
```
VITE_API_URL=https://your-backend-api.com/api
```

---

## 💰 Cost Comparison

| Platform | Frontend | Backend | Database | Total/Month |
|----------|----------|---------|----------|-------------|
| Vercel + Railway | Free | $5 | $5 | $10 |
| Netlify + Heroku | Free | $7 | $9 | $16 |
| DigitalOcean | - | $12 | Included | $12 |
| AWS | $1 | $10 | $15 | $26 |
| VPS (Self-hosted) | - | $5-10 | Included | $5-10 |

---

## 🎯 Recommended Approach for Beginners

**Use Vercel + Railway:**

1. **Push to GitHub** (if not already done)
2. **Deploy Backend on Railway**:
   - Sign up at railway.app
   - New Project → Deploy from GitHub
   - Add MySQL database
   - Set environment variables
   - Deploy automatically

3. **Deploy Frontend on Vercel**:
   - Sign up at vercel.com
   - Import from GitHub
   - Set root directory to `front _end`
   - Add environment variable for API URL
   - Deploy

**Total time**: 15-30 minutes
**Cost**: Free tier available, ~$10/month for production

---

## 📞 Need Help?

Check these resources:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/

---

## Next Steps

1. Choose your deployment platform
2. Follow the specific guide above
3. Test thoroughly after deployment
4. Set up monitoring and backups
5. Configure custom domain (optional)
