# 🎉 Complete Setup & Usage Guide - YellowSense Confidential Clean Room

Welcome! This is your complete guide to running the Welfare Fraud Detection application.

---

## ⚡ Quick Start (2 Minutes)

```bash
cd ok/frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser! 🚀

---

## 🎯 What This App Does

This is a **secure fraud detection system** that allows:
- **Auditors** to create and run fraud analysis workflows
- **Collaborators** to securely contribute data without exposing sensitive information
- **Beautiful visualization** of fraud risk scores and patterns
- **Mock processing** of CSV data (no backend needed for demo)

---

## 👥 Two User Modes

### 1. 👤 Auditor Mode
- Create and manage workflows
- Upload training datasets (accounts + transactions)
- View complete analysis results
- Invite collaborators to contribute data
- Download results as CSV

### 2. 👥 Collaborator Mode
- Contribute encrypted data to workflows
- Maintain data privacy
- Participate in secure analysis
- No access to other parties' raw data

---

## 📝 Step-by-Step Usage

### For Auditors:

1. **Select "Auditor" role** on the workflow page
2. **Enter your ID** (default: "Auditor")
3. **Add collaborators** (comma-separated, e.g., "ClientB, ClientC")
4. **Upload two CSV files:**
   - `ok/frontend/assets/accounts_train.csv`
   - `ok/frontend/assets/transctions_train.csv`
5. **Click "Start Analysis"**
6. **Watch the beautiful processing animation** (~8 seconds)
7. **View results automatically!**

### For Collaborators:

1. **Select "Collaborator" role** on the workflow page
2. **Enter your ID** (default: "ClientB")
3. **Upload your CSV files** (accounts + transactions)
4. **Click "Approve & Submit Data"**
5. **See confirmation** that your data was securely submitted
6. **Wait for auditor** to complete the analysis

---

## 📊 What You'll See

### Dashboard
- **Statistics Cards**: Total workflows, active, completed, datasets
- **Activity Charts**: Bar charts showing workflow trends
- **Status Distribution**: Pie chart of workflow statuses
- **Recent Workflows**: List of your latest workflows

### Workflow Page
- **Role Selection**: Choose Auditor or Collaborator
- **File Upload**: Drag-and-drop or click to upload
- **Processing Animation**: 
  - ⬆️ Uploading (20%)
  - 🔒 Encrypting (50%)
  - ⚙️ Processing (80%)
  - ✅ Completed (100%)
- **Live Logs**: Real-time execution logs

### Results Page
- **Statistics**: High/Medium/Low risk counts
- **Data Table**: All beneficiaries with fraud scores
- **Risk Indicators**: Color-coded risk levels
- **Detail View**: Click any row for detailed breakdown
- **Download**: Export results as CSV

---

## 🎨 Features

✅ **Beautiful Modern UI** - Responsive design with Tailwind CSS
✅ **Smooth Animations** - Framer Motion for fluid transitions
✅ **Real-time Progress** - Live progress bars and status updates
✅ **Interactive Charts** - Recharts for data visualization
✅ **Risk Assessment** - Multi-level fraud scoring (High/Medium/Low)
✅ **CSV Processing** - Upload and parse CSV files
✅ **Mobile Responsive** - Works on all screen sizes
✅ **YellowSense Branding** - Custom logo throughout

---

## 📁 Sample Data Files

Located in `ok/frontend/assets/`:

1. **accounts_train.csv** (Input)
   - Columns: account_id, user_id, kyc_level, country, status, etc.
   - Sample account information for training

2. **transctions_train.csv** (Input)
   - Columns: sender_account_id, receiver_account_id, amount, currency, etc.
   - Transaction records for analysis

3. **final_score.csv** (Results - auto-loaded)
   - Columns: Beneficiary ID, fraud scores, risk levels
   - Located in: `ok/frontend/public/assets/final_score.csv`

---

## 🔧 Technical Details

### Tech Stack
- **React 18** + **TypeScript** - Frontend framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Recharts** - Chart components
- **React Router** - Client-side routing
- **Papa Parse** - CSV parsing
- **React Hot Toast** - Notifications

### Current Mode: Mock Data Demo
- ✅ No backend required
- ✅ All processing in browser
- ✅ Uses sample CSV data
- ✅ Simulates secure processing
- ✅ Safe to test with any files

---

## 🐛 Troubleshooting

### Problem: CSS not loading / Page looks unstyled

**Solution:**
```bash
cd ok/frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Problem: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or edit vite.config.ts to change port
```

### Problem: Results not showing

**Solution:**
```bash
# Ensure final_score.csv is in public folder
cp frontend/assets/final_score.csv frontend/public/assets/
```

### Problem: Logo not showing

**Solution:**
```bash
# Copy logo to public folder
cp frontend/assets/logo.jpeg frontend/public/
```

### Problem: Console errors

**Solution:**
- All backend-related errors are commented out (we're using mock data)
- If you see errors, open DevTools (F12) and check the Console tab
- Most errors can be fixed by clearing cache: Cmd/Ctrl + Shift + R

---

## 🎨 Color Scheme

- **Primary (Yellow/Amber)**: #f59e0b - YellowSense brand color
- **Secondary (Teal)**: #14b8a6 - Accent color
- **Success (Green)**: #22c55e - Low risk, completed states
- **Warning (Orange)**: #f59e0b - Medium risk
- **Error (Red)**: #ef4444 - High risk, errors
- **Info (Blue)**: #3b82f6 - Information messages

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All features work seamlessly across all screen sizes!

---

## 🚀 Available Commands

```bash
# Frontend
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend (optional - not needed for demo)
cd ../backend
npm run dev          # Start backend server (http://localhost:8080)
npm run build        # Compile TypeScript
npm start            # Run production build
```

---

## 🔒 Security Features (Simulated)

The architecture demonstrates:
- **End-to-end encryption** - Data encrypted before upload
- **Zero-trust model** - No plaintext exposure
- **Confidential computing** - TEE simulation
- **Multi-party approval** - Collaborative workflows
- **Audit logging** - Complete activity tracking

*Note: Demo mode simulates these for demonstration purposes*

---

## 💡 Tips & Tricks

1. **Try Both Modes**: Switch between Auditor and Collaborator to see different experiences
2. **Custom IDs**: Change user IDs to test different scenarios
3. **Multiple Collaborators**: Add multiple collaborator IDs separated by commas
4. **Watch the Logs**: The execution logs show detailed processing steps
5. **Explore Results**: Click on any beneficiary in the results table for detailed scores
6. **Download Results**: Use the "Download CSV" button to export analysis

---

## 📈 Understanding the Results

### Risk Levels
- **High Risk**: Final fraud score > 50
- **Medium Risk**: Final fraud score 30-50
- **Low Risk**: Final fraud score < 30

### Score Components
- **Score B**: Behavioral patterns
- **Score R**: Recency indicators
- **Score D**: Duration analysis
- **Score A**: Amount patterns
- **Meta Prob**: Machine learning confidence
- **Rule Risk**: Policy violations
- **Final Score**: Combined fraud score (0-100)

---

## 🎯 What's Next?

### To Use with Real Backend:

1. Navigate to `ok/backend`
2. Run `npm install`
3. Add Google Cloud credentials
4. Start backend: `npm run dev`
5. Backend will run on http://localhost:8080
6. Frontend will automatically connect

### To Deploy:

**Frontend (Vercel/Netlify):**
```bash
cd ok/frontend
npm run build
# Deploy the 'dist' folder
```

**Backend (Cloud Run/Heroku):**
```bash
cd ok/backend
npm run build
# Deploy with your preferred service
```

---

## ✅ Success Checklist

Before you start:
- [ ] Node.js v18+ installed
- [ ] Frontend dependencies installed
- [ ] Dev server running on port 3000
- [ ] Browser opened to http://localhost:3000

When using the app:
- [ ] Selected your role (Auditor or Collaborator)
- [ ] Entered your user ID
- [ ] Uploaded both CSV files
- [ ] Clicked start/submit button
- [ ] Watched the processing animation
- [ ] Viewed the results (Auditor only)

---

## 🆘 Need Help?

### Quick Checks:
1. Is Node.js v18+ installed? (`node --version`)
2. Did you run `npm install`?
3. Is the dev server running? (`npm run dev`)
4. Are you in the `ok/frontend` directory?
5. Did you refresh the browser? (Cmd/Ctrl + Shift + R)

### Common Issues:
- **CSS issues**: Clear cache and reinstall dependencies
- **Port conflicts**: Kill process on port 3000
- **File errors**: Check file paths and permissions
- **Module errors**: Delete node_modules and reinstall

---

## 🎉 You're Ready!

Everything is set up and ready to go!

**Start the app:**
```bash
cd ok/frontend && npm run dev
```

**Open browser:**
http://localhost:3000

**Enjoy analyzing fraud patterns securely! 🔐**

---

## 📞 Support

- **Documentation**: See README.md files in each directory
- **Issues**: Check browser console (F12) for errors
- **Questions**: Review this guide and other .md files

---

**Built with ❤️ by YellowSense Technologies**

Secure. Beautiful. Powerful. 🚀