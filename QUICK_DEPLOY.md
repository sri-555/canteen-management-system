# 🚀 Quick Deploy Guide - Railway + Vercel (Easiest Method)

## Prerequisites
- GitHub account
- Your code pushed to GitHub repository

---

## Step 1: Deploy Backend on Railway (5 minutes)

### 1.1 Sign Up & Create Project
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Select the `backend_pro/canteen` directory as root

### 1.2 Add MySQL Database
1. In your project, click "New"
2. Select "Database" → "MySQL"
3. Railway will automatically create and link the database

### 1.3 Configure Environment Variables
Click on your backend service → Variables → Add these:

```env
DEBUG=False
SECRET_KEY=django-insecure-your-secret-key-change-this-in-production
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=https://*.vercel.app
DATABASE_URL=${{MySQL.DATABASE_URL}}
```

### 1.4 Deploy
- Railway will automatically deploy
- Wait for deployment to complete (2-3 minutes)
- Copy your backend URL (e.g., `https://your-app.railway.app`)

---

## Step 2: Deploy Frontend on Vercel (3 minutes)

### 2.1 Sign Up & Import Project
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository

### 2.2 Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `front _end`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2.3 Add Environment Variable
In the Environment Variables section, add:

```
VITE_API_URL=https://your-app.railway.app/api
```
(Replace with your Railway backend URL from Step 1.4)

### 2.4 Deploy
- Click "Deploy"
- Wait for build to complete (2-3 minutes)
- Your app is live!

---

## Step 3: Initialize Database (2 minutes)

### 3.1 Run Migrations
In Railway dashboard:
1. Go to your backend service
2. Click "Settings" → "Deploy"
3. Or use Railway CLI:
```bash
railway run python manage.py migrate
```

### 3.2 Create Superuser
Use Railway CLI or add this to your deployment:
```bash
railway run python manage.py createsuperuser
```

Or create via Django shell:
```bash
railway run python manage.py shell
```
Then:
```python
from myapp.models import User
User.objects.create_superuser(
    username='superadmin',
    email='admin@example.com',
    password='your-password',
    role='super_admin'
)
```

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Try logging in with test credentials
3. Test all features:
   - Student registration
   - Order placement
   - Admin dashboard
   - Super admin features

---

## 🎉 You're Live!

Your application is now deployed and accessible worldwide!

**Frontend URL**: https://your-app.vercel.app
**Backend URL**: https://your-app.railway.app

---

## 📝 Post-Deployment Tasks

### Update CORS Settings
In Railway, update `CORS_ALLOWED_ORIGINS` with your actual Vercel URL:
```
CORS_ALLOWED_ORIGINS=https://your-actual-app.vercel.app
```

### Set Up Custom Domain (Optional)
- **Vercel**: Settings → Domains → Add your domain
- **Railway**: Settings → Networking → Add custom domain

### Enable HTTPS (Automatic)
Both Railway and Vercel provide free SSL certificates automatically.

---

## 🔧 Troubleshooting

### Backend Issues
- Check Railway logs: Dashboard → Deployments → View Logs
- Verify environment variables are set correctly
- Ensure database is connected

### Frontend Issues
- Check Vercel deployment logs
- Verify `VITE_API_URL` points to correct backend
- Check browser console for errors

### Database Issues
- Verify MySQL service is running in Railway
- Check database connection string
- Run migrations if needed

---

## 💡 Tips

1. **Free Tier Limits**:
   - Railway: $5 free credit/month
   - Vercel: Unlimited for personal projects

2. **Monitoring**:
   - Railway provides built-in metrics
   - Vercel shows analytics and performance

3. **Updates**:
   - Push to GitHub → Auto-deploys on both platforms
   - No manual deployment needed!

---

## 🆘 Need Help?

- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://discord.gg/vercel
- Check deployment logs for error messages
