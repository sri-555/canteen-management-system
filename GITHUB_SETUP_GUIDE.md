# GitHub Setup Guide

## Step 1: Initialize Git Repository

```bash
# Navigate to your project root
cd C:\canteen_management

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Canteen Management System"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/
2. Click the "+" icon in top right
3. Select "New repository"
4. Fill in details:
   - Repository name: `canteen-management-system`
   - Description: "Full-stack canteen management system with Django and React"
   - Choose Public or Private
   - **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/canteen-management-system.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

If you get an error about 'master' vs 'main', run:
```bash
git branch -M main
git push -u origin main
```

## Step 4: Verify Upload

1. Go to your GitHub repository URL
2. Refresh the page
3. You should see all your files

## Important: Before Pushing

### 1. Remove Sensitive Information

Make sure these are NOT in your repository:
- Database passwords
- Secret keys
- Email passwords
- API keys

Update `backend_pro/canteen/canteen/settings.py`:

```python
# Use environment variables for sensitive data
import os

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'your-secret-key-here')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'canteen'),
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '3306'),
    }
}

EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
```

### 2. Create .env.example

Create a template for environment variables:

```bash
# .env.example
DJANGO_SECRET_KEY=your-secret-key-here
DB_NAME=canteen
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 3. Update README

Make sure PROJECT_README.md has:
- Clear installation instructions
- Database setup guide
- Environment variables setup
- Default credentials (for demo only)

## Git Commands Reference

### Basic Commands
```bash
# Check status
git status

# Add specific files
git add filename.py

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Branch Management
```bash
# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# List branches
git branch

# Delete branch
git branch -d feature-name
```

### Undo Changes
```bash
# Discard changes in file
git checkout -- filename

# Unstage file
git reset HEAD filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## Recommended Repository Structure

```
canteen-management-system/
├── .github/
│   └── workflows/          # CI/CD workflows (optional)
├── backend_pro/
├── front_end/
├── docs/                   # Additional documentation
├── .gitignore
├── README.md
├── LICENSE
└── .env.example
```

## Adding Collaborators

1. Go to your repository on GitHub
2. Click "Settings"
3. Click "Collaborators"
4. Click "Add people"
5. Enter their GitHub username
6. Choose permission level

## Creating Releases

1. Go to your repository
2. Click "Releases"
3. Click "Create a new release"
4. Tag version (e.g., v1.0.0)
5. Add release notes
6. Publish release

## Best Practices

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference issues: "Fix #123: Login bug"

### Examples:
```bash
git commit -m "Add user registration feature"
git commit -m "Fix: Checkout button not working"
git commit -m "Update: Improve error handling in API"
git commit -m "Docs: Add installation guide"
```

### Branch Naming
- `feature/user-authentication`
- `bugfix/login-error`
- `hotfix/security-patch`
- `docs/api-documentation`

### Regular Commits
- Commit frequently
- Each commit should be a logical unit
- Don't commit broken code to main branch

## Troubleshooting

### Authentication Issues

If you get authentication errors:

1. **Use Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with repo permissions
   - Use token as password when pushing

2. **Configure Git Credentials**:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Large Files

If you have large files (>100MB):
```bash
# Use Git LFS
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

### Merge Conflicts

If you get merge conflicts:
```bash
# Pull latest changes
git pull

# Resolve conflicts in files
# Then:
git add .
git commit -m "Resolve merge conflicts"
git push
```

## GitHub Features to Use

### 1. Issues
- Track bugs and feature requests
- Assign to team members
- Add labels and milestones

### 2. Projects
- Kanban board for task management
- Track progress
- Link issues and pull requests

### 3. Wiki
- Additional documentation
- User guides
- API documentation

### 4. Actions (CI/CD)
- Automated testing
- Deployment pipelines
- Code quality checks

## Security Checklist

Before pushing to GitHub:

- [ ] No passwords in code
- [ ] No API keys in code
- [ ] No database credentials in code
- [ ] .gitignore is properly configured
- [ ] Sensitive files are excluded
- [ ] .env.example created (without actual values)
- [ ] README has setup instructions
- [ ] Default demo credentials documented

## Next Steps After Pushing

1. Add a LICENSE file
2. Create CONTRIBUTING.md
3. Set up GitHub Actions for CI/CD
4. Add badges to README (build status, etc.)
5. Create project documentation
6. Set up issue templates
7. Add code of conduct

## Useful GitHub Links

- Repository: `https://github.com/YOUR_USERNAME/canteen-management-system`
- Issues: `https://github.com/YOUR_USERNAME/canteen-management-system/issues`
- Pull Requests: `https://github.com/YOUR_USERNAME/canteen-management-system/pulls`
- Settings: `https://github.com/YOUR_USERNAME/canteen-management-system/settings`

## Support

If you encounter issues:
1. Check GitHub documentation: https://docs.github.com/
2. Search Stack Overflow
3. Ask in GitHub Community: https://github.community/

Good luck with your project! 🚀
