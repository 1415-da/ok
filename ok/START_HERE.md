# 🎯 START HERE - Quick Demo Guide

## ⚡ Get Running in 2 Minutes

### Step 1: Install Dependencies
```bash
cd ok/frontend
npm install
```

### Step 2: Start the App
```bash
npm run dev
```

### Step 3: Open Browser
Go to: **http://localhost:3000**

---

## 🎮 How to Use

1. **Click "New Workflow"** button
2. **Upload files:**
   - First: `ok/frontend/assets/accounts_train.csv`
   - Second: `ok/frontend/assets/transctions_train.csv`
3. **Click "Start Analysis"**
4. **Watch the beautiful animation** (8 seconds)
5. **See the results!**

---

## ✨ What You'll See

- 📊 Beautiful dashboard with charts
- 🎨 Smooth animations and transitions
- 📈 Real-time progress tracking
- 🎯 Risk level indicators (High/Medium/Low)
- 📋 Detailed fraud detection scores
- 💾 Downloadable results

---

## 🔧 Troubleshooting

### CSS not loading?
```bash
cd ok/frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Results not showing?
```bash
# Ensure CSV file is in the right place
cp frontend/assets/final_score.csv frontend/public/assets/
```

### Port already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 📁 Important Files

- **Upload these:** `frontend/assets/accounts_train.csv` & `transctions_train.csv`
- **Results from:** `frontend/public/assets/final_score.csv`
- **Main pages:** Dashboard, Workflow, Results

---

## 💡 This is a Demo

- ✅ Uses mock data (no backend needed)
- ✅ All processing happens in browser
- ✅ No data sent anywhere
- ✅ Safe to test with any CSV files

---

## 🚀 Ready?

```bash
cd ok/frontend && npm install && npm run dev
```

Then open **http://localhost:3000** and start uploading! 🎉

---

**Questions?** Check `QUICK_START.md` for detailed guide.