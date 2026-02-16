# Deployment Guide - Get Your Site Live

## 🌐 Your GitHub Repository
**Code Repository**: https://github.com/sri-555/canteen-management-system

## 🚀 Deployment Options

### Option 1: GitHub Pages (Frontend Only - FREE)

GitHub Pages can host your React frontend for free.

**Limitations**: 
- Only frontend (no backend/database)
- Good for portfolio/demo purposes
- Backend APIs won't work

**Steps**:

1. **Install gh-pages package**:
```bash
cd front_end
npm install --save-dev gh-pages
```

2. **Update package.json**:
Add these lines to `front_end/package.json`:
```json
{
  "homepage": "https://sri-555.github.io/canteen-management-system",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Deploy**:
```bash
npm run deploy
```

4. **Enable GitHub Pages**:
- Go to repository Settings
- Click "Pages" in sidebar
- Source: Deploy from branch
- Branch: gh-pages
- Click Save

**Your site will be live at**: https://sri-555.github.io/canteen-management-system

---

### Option 2: Vercel (Frontend) + Railway (Backend) - FREE

**Best for full-stack apps with database**

#### Deploy Frontend to Vercel:

1. **Go to**: https://vercel.com/
2. **Sign up** with GitHub
3. **Import Project**: 
   - Click "Add New" → "Project"
   - Select your repository
   - Framework: Vite
   - Root Directory: `front_end`
   - Click Deploy

**Your frontend will be live at**: `https://your-project.vercel.app`

#### Deploy Backend to Railway:

1. **Go to**: https://railway.app/
2. **Sign up** with GitHub
3. **New Project** → Deploy from GitHub repo
4. **Select** your repository
5. **Add MySQL database**:
   - Click "New" → "Database" → "MySQL"
6. **Configure environment variables**:
   - Add all settings from settings.py
   - Database credentials from Railway MySQL
7. **Deploy**

**Your backend will be live at**: `https://your-project.railway.app`

---

### Option 3: Render (Full Stack) - FREE

**All-in-one solution**

1. **Go to**: https://render.com/
2. **Sign up** with GitHub
3. **New Web Service**:
   - Connect your repository
   - Name: canteen-backend
   - Environment: Python
   - Build Command: `pip install -r backend_pro/requirements.txt`
   - Start Command: `cd backend_pro/canteen && python manage.py runserver 0.0.0.0:$PORT`
4. **Add MySQL Database**:
   - New → PostgreSQL (or use external MySQL)
5. **Deploy Frontend**:
   - New → Static Site
   - Build Command: `cd front_end && npm install && npm run build`
   - Publish Directory: `front_end/dist`

---

### Option 4: Netlify (Frontend) - FREE

1. **Go to**: https://www.netlify.com/
2. **Sign up** with GitHub
3. **Add new site** → Import from Git
4. **Configure**:
   - Base directory: `front_end`
   - Build command: `npm run build`
   - Publish directory: `front_end/dist`
5. **Deploy**

**Your site will be live at**: `https://your-project.netlify.app`

---

### Option 5: Heroku (Full Stack) - PAID

Heroku now requires payment for hosting.

---

## 🎯 Recommended Setup for Your Project

### For Portfolio/Demo (No Backend):
**Use GitHub Pages** - Completely free, easy setup

### For Full Functionality:
**Use Vercel (Frontend) + Railway (Backend)**
- Both have free tiers
- Easy to set up
- Good performance
- Custom domains available

## 📝 Quick Setup - GitHub Pages (Easiest)

Run these commands:

```bash
# 1. Go to frontend directory
cd front_end

# 2. Install gh-pages
npm install --save-dev gh-pages

# 3. Add to package.json (manually or use editor)
# Add: "homepage": "https://sri-555.github.io/canteen-management-system"
# Add to scripts: "deploy": "gh-pages -d dist"

# 4. Build and deploy
npm run build
npm run deploy
```

Then enable GitHub Pages in repository settings!

## 🔗 Your Links After Deployment

### GitHub Repository (Code):
https://github.com/sri-555/canteen-management-system

### GitHub Pages (Demo Site):
https://sri-555.github.io/canteen-management-system

### Vercel (if you use it):
https://canteen-management-system.vercel.app

### Netlify (if you use it):
https://canteen-management-system.netlify.app

## ⚙️ Environment Variables for Production

When deploying, you'll need to set these:

**Backend**:
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DB_NAME=canteen
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=your-db-host
DB_PORT=3306
```

**Frontend**:
```
VITE_API_URL=https://your-backend-url.com/api
```

## 🎨 Custom Domain (Optional)

After deployment, you can add a custom domain:

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Add to your hosting**:
   - GitHub Pages: Settings → Pages → Custom domain
   - Vercel: Project Settings → Domains
   - Netlify: Site Settings → Domain management

## 📊 Monitoring Your Site

After deployment:
- Check site is loading
- Test all features
- Monitor errors
- Check performance

## 🆘 Troubleshooting

### Site not loading?
- Check build logs
- Verify environment variables
- Check CORS settings

### API not working?
- Update API URL in frontend
- Check backend is running
- Verify CORS configuration

### Database errors?
- Check database credentials
- Run migrations on production
- Verify database is accessible

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app/
- Netlify Docs: https://docs.netlify.com/
- GitHub Pages: https://pages.github.com/

## 🎉 Next Steps

1. Choose a deployment option
2. Follow the steps above
3. Test your live site
4. Share the link!

Good luck with your deployment! 🚀
