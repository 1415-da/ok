# 🚀 Quick Start Guide - Confidential Clean Room Demo

Get the application running in 5 minutes with mock data!

---

## 📋 What You'll Need

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **A terminal/command prompt**
- **5 minutes of your time**

---

## 🎯 Step-by-Step Setup

### Step 1: Install Frontend Dependencies

Open your terminal and run:

```bash
cd ok/frontend
npm install
```

This will install all required packages (React, Tailwind CSS, etc.)

### Step 2: Start the Frontend

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 3: Open in Browser

Open your browser and go to: **http://localhost:3000**

---

## 🎨 Using the Application

### 1. Dashboard
- View statistics and analytics
- See charts and graphs
- Navigate to workflow creation

### 2. Create Workflow

Click **"New Workflow"** button and:

1. **Upload Accounts File**
   - Click the first upload box
   - Select `ok/frontend/assets/accounts_train.csv`
   - You'll see a green checkmark

2. **Upload Transactions File**
   - Click the second upload box
   - Select `ok/frontend/assets/transctions_train.csv`
   - You'll see a green checkmark

3. **Start Analysis**
   - Click the **"Start Analysis"** button
   - Watch the beautiful processing animation:
     - ⬆️ Uploading (20%)
     - 🔒 Encrypting (50%)
     - ⚙️ Processing (80%)
     - ✅ Completed (100%)

### 3. View Results

After processing completes (~8 seconds), you'll automatically see:

- **Statistics Cards**: High/Medium/Low risk counts
- **Results Table**: All beneficiaries with fraud scores
- **Risk Levels**: Color-coded risk indicators
- **Detail View**: Click any row to see detailed scores

---

## 📊 What's Happening Behind the Scenes?

This demo uses **mock data** to simulate the full workflow:

1. **Files Upload**: Your CSV files are read locally (not sent anywhere)
2. **Processing**: Simulated with realistic timing and progress
3. **Results**: Loads from `public/assets/final_score.csv`
4. **Display**: Beautiful visualization of fraud detection scores

### Mock Data Flow

```
User Uploads CSVs
       ↓
Simulated Processing (8 seconds)
       ↓
Loads final_score.csv
       ↓
Displays Beautiful Results
```

---

## 🎯 Key Features

### ✅ What Works Now

- [x] Beautiful responsive UI
- [x] File upload with validation
- [x] Real-time processing animation
- [x] Progress tracking (0-100%)
- [x] Live execution logs
- [x] Results visualization
- [x] Risk level indicators
- [x] Statistics dashboard
- [x] Detail view for each record
- [x] CSV download
- [x] Smooth page transitions

### 🔄 What's Simulated

- File encryption (shown in animation)
- Secure upload (happens locally)
- TEE processing (mock timing)
- Backend API calls (uses mock data)

---

## 📁 File Locations

### Sample Data Files
```
ok/frontend/assets/
├── accounts_train.csv       ← Upload this first
├── transctions_train.csv    ← Upload this second
└── final_score.csv          ← Results (auto-loaded)
```

### Results File Location
```
ok/frontend/public/assets/
└── final_score.csv          ← Accessed by the app
```

---

## 🐛 Troubleshooting

### Issue: "CSS not loading" / Page looks unstyled

**Solution:**
```bash
cd ok/frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or edit vite.config.ts to use a different port
```

### Issue: "File not found" when viewing results

**Solution:**
```bash
# Ensure final_score.csv is in the right place
cp frontend/assets/final_score.csv frontend/public/assets/
```

### Issue: Page is blank or shows errors

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Clear browser cache

---

## 🎨 UI Features

### Colors & Themes

- **Primary**: Yellow/Amber (#f59e0b) - Brand color
- **Secondary**: Teal (#14b8a6) - Accents
- **Success**: Green - Low risk, completed states
- **Warning**: Orange - Medium risk
- **Error**: Red - High risk, errors

### Animations

- ✨ Smooth page transitions
- 📊 Progress bar animations
- 🔄 Loading spinners
- 💫 Hover effects
- 🎯 Step indicators

### Responsive Design

- 📱 Mobile: < 640px
- 💻 Tablet: 640px - 1024px
- 🖥️ Desktop: > 1024px

---

## 🔧 Advanced Configuration

### Change Animation Speed

Edit `ok/frontend/src/pages/WorkflowPage.tsx`:

```typescript
// Find this line (around line 70):
await new Promise((resolve) => setTimeout(resolve, 800));

// Change 800 to desired milliseconds:
await new Promise((resolve) => setTimeout(resolve, 500)); // Faster
await new Promise((resolve) => setTimeout(resolve, 1500)); // Slower
```

### Customize Colors

Edit `ok/frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#your-color-here',
    // ... other shades
  }
}
```

---

## 📊 Results Data Format

The `final_score.csv` contains:

| Column | Description |
|--------|-------------|
| Beneficiary ID | Unique identifier |
| score_b | Behavioral score (0-1) |
| score_r | Recency score (0-1) |
| score_d | Duration score (0-1) |
| score_a | Amount score (0-1) |
| meta_prob | Meta-learning probability (0-1) |
| rule_risk_score | Rule-based risk (0-1) |
| final_fraud_score | Final fraud score (0-100) |

### Risk Level Calculation

- **High Risk**: final_fraud_score > 50
- **Medium Risk**: final_fraud_score 30-50
- **Low Risk**: final_fraud_score < 30

---

## 🎓 Next Steps

Once you're comfortable with the demo:

1. **Connect Real Backend**: Follow `SETUP_GUIDE.md` to set up the TypeScript backend
2. **Use Real Data**: Replace CSV files with your own data
3. **Deploy**: Build for production with `npm run build`
4. **Customize**: Modify colors, add features, change animations

---

## 📝 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean install
rm -rf node_modules && npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

---

## 🎉 You're All Set!

Your Confidential Clean Room demo is now running with mock data!

**Enjoy exploring the beautiful UI and workflow! 🚀**

---

## 💡 Tips

- **Upload Speed**: Files are processed instantly (it's mocked)
- **Processing Time**: Fixed at ~8 seconds for demo effect
- **Results**: Always shows the same data from final_score.csv
- **No Backend**: Everything runs in your browser
- **No Data Sent**: Your uploads stay on your device

---

## 📞 Need Help?

- Check the browser console (F12) for errors
- Ensure Node.js v18+ is installed
- Try clearing cache and reinstalling dependencies
- Make sure you're in the `ok/frontend` directory

---

**Built with ❤️ by YellowSense Technologies**

Ready to analyze fraud patterns in a secure environment! 🔒