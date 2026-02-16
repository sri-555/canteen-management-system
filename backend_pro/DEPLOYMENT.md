# Deployment Guide

## Local Development Setup

### Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)

### Steps

1. **Clone and Navigate**
```bash
cd backend_pro
```

2. **Create Virtual Environment**
```bash
python -m venv env
```

3. **Activate Virtual Environment**

Windows:
```bash
env\Scripts\activate
```

Linux/Mac:
```bash
source env/bin/activate
```

4. **Install Dependencies**
```bash
pip install -r requirements.txt
```

5. **Navigate to Project**
```bash
cd canteen
```

6. **Run Migrations**
```bash
python manage.py migrate
```

7. **Create Sample Data**
```bash
python create_sample_data.py
```

8. **Run Development Server**
```bash
python manage.py runserver
```

Server runs at: `http://localhost:8000`

## Production Deployment

### Environment Variables

Create a `.env` file:
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Update settings.py for Production

```python
import os
from pathlib import Path

SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

# Database - PostgreSQL for production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# CORS
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_ALL_ORIGINS = False

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
```

### Deploy to Heroku

1. **Install Heroku CLI**
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Create Procfile**
```
web: gunicorn canteen.wsgi --log-file -
```

3. **Update requirements.txt**
```bash
pip install gunicorn psycopg2-binary python-decouple
pip freeze > requirements.txt
```

4. **Create runtime.txt**
```
python-3.12.0
```

5. **Initialize Git**
```bash
git init
git add .
git commit -m "Initial commit"
```

6. **Create Heroku App**
```bash
heroku create your-app-name
```

7. **Add PostgreSQL**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

8. **Set Environment Variables**
```bash
heroku config:set SECRET_KEY='your-secret-key'
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS='your-app-name.herokuapp.com'
```

9. **Deploy**
```bash
git push heroku main
```

10. **Run Migrations**
```bash
heroku run python manage.py migrate
```

11. **Create Superuser**
```bash
heroku run python manage.py createsuperuser
```

### Deploy to AWS EC2

1. **Launch EC2 Instance**
- Ubuntu 22.04 LTS
- t2.micro or larger
- Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Update System**
```bash
sudo apt update
sudo apt upgrade -y
```

4. **Install Dependencies**
```bash
sudo apt install python3-pip python3-venv nginx postgresql postgresql-contrib -y
```

5. **Clone Repository**
```bash
git clone your-repo-url
cd backend_pro/canteen
```

6. **Setup Virtual Environment**
```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

7. **Setup PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE canteen_db;
CREATE USER canteen_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE canteen_db TO canteen_user;
\q
```

8. **Configure Django**
Update settings.py with production database settings

9. **Run Migrations**
```bash
python manage.py migrate
python manage.py collectstatic
```

10. **Setup Gunicorn Service**
Create `/etc/systemd/system/gunicorn.service`:
```ini
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/backend_pro/canteen
ExecStart=/home/ubuntu/backend_pro/canteen/env/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/home/ubuntu/backend_pro/canteen/canteen.sock \
          canteen.wsgi:application

[Install]
WantedBy=multi-user.target
```

11. **Start Gunicorn**
```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

12. **Configure Nginx**
Create `/etc/nginx/sites-available/canteen`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        root /home/ubuntu/backend_pro/canteen;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/backend_pro/canteen/canteen.sock;
    }
}
```

13. **Enable Nginx Site**
```bash
sudo ln -s /etc/nginx/sites-available/canteen /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

14. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Deploy to DigitalOcean

Similar to AWS EC2, but use DigitalOcean's App Platform for easier deployment:

1. **Create App**
- Connect GitHub repository
- Select Python environment
- Set build command: `pip install -r requirements.txt`
- Set run command: `gunicorn canteen.wsgi`

2. **Add Database**
- Add PostgreSQL database component
- Environment variables auto-configured

3. **Set Environment Variables**
- SECRET_KEY
- DEBUG=False
- ALLOWED_HOSTS

4. **Deploy**
- Automatic deployment on git push

## Docker Deployment

### Dockerfile
```dockerfile
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY canteen/ .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "canteen.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: canteen_db
      POSTGRES_USER: canteen_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    command: gunicorn canteen.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://canteen_user:your_password@db:5432/canteen_db
      - SECRET_KEY=your-secret-key
      - DEBUG=False
    depends_on:
      - db

volumes:
  postgres_data:
```

### Build and Run
```bash
docker-compose up --build
```

## Post-Deployment Checklist

- [ ] Update SECRET_KEY to a secure random string
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Setup PostgreSQL database
- [ ] Run migrations
- [ ] Create superuser
- [ ] Configure CORS for frontend domain
- [ ] Setup SSL certificate
- [ ] Configure static files serving
- [ ] Setup backup strategy
- [ ] Configure monitoring (Sentry, etc.)
- [ ] Setup logging
- [ ] Configure email backend
- [ ] Test all API endpoints
- [ ] Load test the application
- [ ] Setup CI/CD pipeline

## Monitoring & Maintenance

### Logs
```bash
# Heroku
heroku logs --tail

# EC2
sudo journalctl -u gunicorn -f
sudo tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
# PostgreSQL
pg_dump -U canteen_user canteen_db > backup.sql

# Restore
psql -U canteen_user canteen_db < backup.sql
```

### Performance Monitoring
- Use Django Debug Toolbar (development only)
- Setup Sentry for error tracking
- Use New Relic or DataDog for APM
- Monitor database query performance

## Scaling Considerations

1. **Database**
   - Use connection pooling (pgbouncer)
   - Add read replicas
   - Optimize queries with indexes

2. **Caching**
   - Add Redis for caching
   - Cache food court lists
   - Cache menu items

3. **Load Balancing**
   - Use multiple Gunicorn workers
   - Add load balancer (AWS ELB, Nginx)
   - Horizontal scaling with multiple servers

4. **CDN**
   - Serve static files via CDN
   - Cache API responses where appropriate

5. **Background Tasks**
   - Use Celery for async tasks
   - Send notifications asynchronously
   - Generate reports in background

## Security Best Practices

1. Keep SECRET_KEY secret and random
2. Use HTTPS in production
3. Set secure cookie flags
4. Implement rate limiting
5. Regular security updates
6. Use environment variables for secrets
7. Enable CSRF protection
8. Validate all user inputs
9. Use parameterized queries (Django ORM does this)
10. Regular security audits

## Troubleshooting

### Common Issues

**Static files not loading**
```bash
python manage.py collectstatic
```

**Database connection error**
- Check DATABASE_URL
- Verify database credentials
- Ensure database server is running

**CORS errors**
- Update CORS_ALLOWED_ORIGINS
- Check frontend URL

**502 Bad Gateway**
- Check Gunicorn is running
- Verify socket file permissions
- Check Nginx configuration

**Memory issues**
- Increase server resources
- Optimize database queries
- Add caching layer
