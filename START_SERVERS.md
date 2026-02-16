# Quick Start - Run Both Servers

## Option 1: Manual Start (Recommended for Development)

### Terminal 1 - Backend Server
```bash
cd backend_pro/canteen
python manage.py runserver
```
Backend runs at: `http://localhost:8000`

### Terminal 2 - Frontend Server
```bash
cd "front _end"
npm run dev
```
Frontend runs at: `http://localhost:5173`

## Option 2: Windows Batch Script

Create `start_servers.bat` in the root directory:

```batch
@echo off
echo Starting Canteen Management System...
echo.

echo Starting Backend Server...
start cmd /k "cd backend_pro\canteen && python manage.py runserver"

timeout /t 3

echo Starting Frontend Server...
start cmd /k "cd front _end && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
pause
```

Then double-click `start_servers.bat` to run both servers.

## Option 3: PowerShell Script

Create `start_servers.ps1` in the root directory:

```powershell
Write-Host "Starting Canteen Management System..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend_pro\canteen; python manage.py runserver"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'front _end'; npm run dev"

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
```

Run with: `powershell -ExecutionPolicy Bypass -File start_servers.ps1`

## Verify Servers Are Running

### Check Backend
Open browser: `http://localhost:8000/api/`
Should see Django REST Framework browsable API

### Check Frontend
Open browser: `http://localhost:5173`
Should see the login page

## Test Login

Use these credentials:

**Student:**
- Username: `student1`
- Password: `student123`

**Food Court Admin:**
- Username: `cafeteria_admin`
- Password: `admin123`

**Super Admin:**
- Username: `superadmin`
- Password: `admin123`

## Troubleshooting

### Backend won't start
- Make sure you're in the virtual environment
- Check if port 8000 is already in use
- Run: `python manage.py migrate` if database errors occur

### Frontend won't start
- Run: `npm install` if dependencies are missing
- Check if port 5173 is already in use
- Clear node_modules and reinstall if needed

### CORS Errors
- Make sure backend is running first
- Check `.env` file has correct API URL
- Verify CORS is enabled in Django settings

### Can't login
- Make sure sample data is created: `python create_sample_data.py`
- Check browser console for errors
- Verify API URL in `.env` file

## Stop Servers

Press `Ctrl+C` in each terminal window to stop the servers.

## Development Workflow

1. Start both servers
2. Make changes to code
3. Frontend auto-reloads (Vite HMR)
4. Backend auto-reloads (Django dev server)
5. Test changes in browser
6. Check browser console and network tab for errors

## Production Deployment

For production, see:
- `backend_pro/DEPLOYMENT.md` - Backend deployment guide
- Build frontend: `npm run build` in front _end folder
- Serve frontend build with Nginx or similar
- Use production database (PostgreSQL)
- Set DEBUG=False in Django
- Configure proper CORS origins
