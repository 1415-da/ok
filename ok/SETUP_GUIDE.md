# 🚀 Complete Setup Guide - Confidential Clean Room Application

This guide will help you set up both the TypeScript backend and React frontend from scratch.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **Git** (optional, for version control)
- A code editor (VS Code recommended)

Check your versions:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

---

## 🎯 Quick Start (Development Mode)

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd ok/backend

# Install dependencies
npm install

# Create uploads and temp directories
mkdir -p uploads temp

# Start the backend server
npm run dev
```

The backend will start on **http://localhost:8080**

### Step 2: Setup Frontend (in a new terminal)

```bash
# Navigate to frontend directory
cd ok/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:3000**

### Step 3: Open in Browser

Open your browser and go to: **http://localhost:3000**

---

## 🔧 Detailed Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd ok/backend
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - Express.js (web framework)
   - TypeScript (type safety)
   - Google Cloud SDK (BigQuery & Storage)
   - And other dependencies

3. **Create required directories:**
   ```bash
   mkdir -p uploads temp
   ```

4. **Configure environment (optional for development):**
   
   The backend works without GCP credentials in development mode. If you want to use real GCP services, create a `.env` file:
   
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your GCP credentials.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 =============================================
   🚀 Confidential Clean Room Backend
   🚀 =============================================
   🚀 Server running on port: 8080
   🚀 API Base URL: http://localhost:8080/api
   🚀 =============================================
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ok/frontend
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - React & React DOM
   - TypeScript
   - Tailwind CSS
   - Vite (build tool)
   - And other dependencies

3. **Verify Tailwind CSS setup:**
   
   Make sure these files exist:
   - `tailwind.config.js`
   - `postcss.config.js`
   - `src/index.css`

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.0.8  ready in XXX ms

   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ➜  press h to show help
   ```

5. **Open in browser:**
   
   Navigate to: http://localhost:3000

---

## 🎨 Frontend CSS Troubleshooting

If the CSS is not loading properly, follow these steps:

### Fix 1: Clear Cache and Reinstall

```bash
cd ok/frontend

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Restart dev server
npm run dev
```

### Fix 2: Verify Tailwind Configuration

Check that `tailwind.config.js` includes all content paths:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of config
}
```

### Fix 3: Check PostCSS Configuration

Verify `postcss.config.js` exists and contains:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Fix 4: Verify CSS Import in main.tsx

Check that `src/main.tsx` imports the CSS file:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'  // ← This line is crucial!
```

### Fix 5: Hard Refresh Browser

1. Open DevTools (F12 or Cmd+Option+I)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### Fix 6: Check for Errors

Open browser DevTools Console (F12) and check for:
- Network errors (red items in Network tab)
- Console errors
- Failed CSS loads

---

## 📁 Project Structure Overview

```
ok/
├── backend/                    # TypeScript Backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # API controllers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Express middleware
│   │   ├── types/             # TypeScript types
│   │   └── index.ts           # Entry point
│   ├── uploads/               # Temporary file storage
│   ├── temp/                  # Temporary working directory
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── assets/            # Static files (CSV samples)
    │   ├── components/        # React components
    │   │   └── Layout.tsx     # Main layout
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.tsx
    │   │   ├── WorkflowPage.tsx
    │   │   └── ResultsPage.tsx
    │   ├── services/          # API client
    │   │   └── api.ts
    │   ├── App.tsx            # Main app component
    │   ├── main.tsx           # Entry point
    │   └── index.css          # Global styles + Tailwind
    ├── index.html             # HTML template
    ├── package.json
    ├── tailwind.config.js     # Tailwind configuration
    ├── postcss.config.js      # PostCSS configuration
    ├── vite.config.ts         # Vite configuration
    └── README.md
```

---

## 🧪 Testing the Application

### 1. Backend Health Check

Open in browser or use curl:

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "success": true,
  "message": "Confidential Clean Room Backend is running",
  "timestamp": "2024-10-20T...",
  "environment": "development"
}
```

### 2. Frontend Loading

1. Open http://localhost:3000
2. You should see the Dashboard with:
   - YellowSense branding
   - Navigation menu
   - Statistics cards
   - Charts

### 3. Upload Test Files

The frontend includes sample CSV files in `frontend/assets/`:
- `accounts_train.csv`
- `transctions_train.csv` (note: typo in original)
- `final_score.csv`

Use these for testing the workflow.

---

## 🔄 Development Workflow

### Making Changes to Backend

1. Edit files in `backend/src/`
2. Save the file
3. The server automatically restarts (thanks to tsx watch mode)
4. Check terminal for any errors

### Making Changes to Frontend

1. Edit files in `frontend/src/`
2. Save the file
3. Vite hot-reloads the changes instantly
4. Browser updates automatically

---

## 🏗️ Building for Production

### Backend

```bash
cd ok/backend

# Build TypeScript to JavaScript
npm run build

# Output will be in dist/ folder

# Run production build
npm start
```

### Frontend

```bash
cd ok/frontend

# Build optimized production bundle
npm run build

# Output will be in dist/ folder

# Preview production build locally
npm run preview
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:** `Port 8080 is already in use`

**Solution:**
```bash
# Find process using port 8080
lsof -ti:8080

# Kill the process
kill -9 $(lsof -ti:8080)

# Or use a different port in .env
PORT=8081
```

### Issue 2: Module Not Found

**Error:** `Cannot find module 'xxx'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: TypeScript Errors

**Error:** TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript configuration
npm run type-check

# Update TypeScript
npm install -D typescript@latest
```

### Issue 4: CSS Not Loading

**Solution:** See "Frontend CSS Troubleshooting" section above

### Issue 5: API Connection Failed

**Error:** Network error when uploading files

**Solution:**
1. Ensure backend is running on port 8080
2. Check browser console for CORS errors
3. Verify VITE_API_URL in frontend/.env (if it exists)

---

## 📝 Environment Variables

### Backend (.env)

```env
PORT=8080
NODE_ENV=development
GCP_PROJECT_ID=your-project-id
GCP_DATASET=cleanroom
GCP_BUCKET=your-bucket-name
EXECUTOR_URL=http://localhost:8443
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=YellowSense Confidential Clean Room
```

---

## 🎯 Using the Application

### Step 1: Access Dashboard

1. Navigate to http://localhost:3000
2. View statistics and recent workflows
3. See charts and analytics

### Step 2: Create a Workflow

1. Click "New Workflow" button
2. Upload two CSV files:
   - Accounts training data
   - Transactions training data
3. Click "Start Analysis"

### Step 3: Monitor Processing

1. Watch real-time progress bar
2. View execution logs
3. See step-by-step status updates

### Step 4: View Results

1. Automatically redirected to results page
2. View result files
3. Download CSV/JSON outputs
4. See metrics and analysis

---

## 🔐 Security Notes

For development:
- Backend runs without authentication
- GCP credentials are optional
- File uploads are simulated

For production:
- Add proper authentication
- Configure real GCP credentials
- Enable HTTPS
- Add rate limiting
- Implement proper error handling

---

## 📚 Additional Resources

### Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Express.js](https://expressjs.com/)

### Useful Commands

```bash
# Backend
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run linter
npm start        # Start production server

# Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

---

## 🆘 Getting Help

If you encounter issues:

1. **Check the terminal** for error messages
2. **Check browser console** (F12) for errors
3. **Clear cache** and restart servers
4. **Reinstall dependencies** (rm -rf node_modules && npm install)
5. **Check port conflicts** (ensure 8080 and 3000 are free)

---

## ✅ Success Checklist

- [ ] Node.js v18+ installed
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] CSS styles loading properly
- [ ] Can navigate between pages
- [ ] Can upload files
- [ ] Can view results

---

## 🎉 You're All Set!

Your Confidential Clean Room application is now running!

- **Backend API:** http://localhost:8080
- **Frontend UI:** http://localhost:3000
- **API Docs:** http://localhost:8080/api

Start uploading datasets and running secure workflows! 🚀

---

**Built with ❤️ by YellowSense Technologies**