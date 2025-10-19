# 🏆 Confidential Clean Room - Fraud Detection System

A secure, beautiful web application for analyzing welfare fraud patterns using confidential computing principles. Built with TypeScript (Backend) and React (Frontend).

---

## 🌟 Features

- **🎨 Beautiful Modern UI** - Responsive design with smooth animations
- **🔒 Secure Processing** - Simulates confidential computing environment
- **📊 Real-time Analytics** - Live progress tracking and statistics
- **📈 Data Visualization** - Interactive charts and risk indicators
- **🎯 Risk Assessment** - Multi-level fraud detection scoring
- **💾 CSV Processing** - Upload and analyze transaction data
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

---

## 🚀 Quick Start (Demo Mode)

Get the demo running in 2 minutes with mock data:

```bash
# Navigate to frontend
cd ok/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser!

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 🎮 How to Use

### 1. Access Dashboard
- View workflow statistics
- See analytics charts
- Monitor recent activities

### 2. Create Workflow
1. Click **"New Workflow"** button
2. Upload **accounts_train.csv** (`ok/frontend/assets/accounts_train.csv`)
3. Upload **transctions_train.csv** (`ok/frontend/assets/transctions_train.csv`)
4. Click **"Start Analysis"**

### 3. Watch Processing
- ⬆️ **Uploading** - Files being uploaded
- 🔒 **Encrypting** - Data encryption
- ⚙️ **Processing** - Fraud analysis
- ✅ **Completed** - Results ready!

### 4. View Results
- See fraud detection scores
- View risk levels (High/Medium/Low)
- Download results as CSV
- Explore detailed metrics

---

## 📁 Project Structure

```
ok/
├── backend/                    # TypeScript Backend (Express.js)
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # API Controllers
│   │   ├── services/          # Business Logic
│   │   ├── routes/            # API Routes
│   │   ├── middleware/        # Express Middleware
│   │   └── types/             # TypeScript Types
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React Frontend (TypeScript + Tailwind)
│   ├── src/
│   │   ├── assets/            # Sample CSV files
│   │   ├── components/        # React Components
│   │   ├── pages/             # Page Components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── WorkflowPage.tsx
│   │   │   └── ResultsPage.tsx
│   │   ├── services/          # API Service
│   │   └── App.tsx
│   ├── public/
│   │   └── assets/            # Public assets (CSV results)
│   ├── package.json
│   └── README.md
│
├── Confidential-Clean-Rooms/  # Original Python Implementation
├── START_HERE.md              # Quick start guide
├── QUICK_START.md             # Detailed setup guide
├── SETUP_GUIDE.md             # Full setup instructions
└── README.md                  # This file
```

---

## 🎯 Current Mode: Mock Data Demo

The application currently runs in **demo mode** using mock data:

✅ **What Works:**
- Full UI/UX with animations
- File upload interface
- Processing simulation (8 seconds)
- Results visualization from `final_score.csv`
- Risk level calculation
- Statistics dashboard
- CSV download

🔄 **What's Simulated:**
- Backend API calls
- Data encryption
- TEE processing
- Cloud storage upload

📦 **No Backend Required!**
All processing happens in the browser using mock data.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data Visualization
- **React Router** - Navigation
- **Papa Parse** - CSV Parsing
- **React Hot Toast** - Notifications

### Backend (Not Required for Demo)
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **TypeScript** - Type Safety
- **Google Cloud SDK** - Cloud Services
- **BigQuery** - Metadata Storage
- **Cloud Storage** - File Storage

---

## 📊 Sample Data

### Input Files
- **accounts_train.csv** - Account information
  - Columns: account_id, user_id, kyc_level, country, status, etc.
  
- **transctions_train.csv** - Transaction records
  - Columns: sender_account_id, receiver_account_id, amount, currency, etc.

### Output File
- **final_score.csv** - Fraud detection results
  - Columns: Beneficiary ID, fraud scores, risk levels, etc.

---

## 🎨 UI Features

### Color Scheme
- **Primary**: Amber/Yellow (#f59e0b) - YellowSense brand
- **Secondary**: Teal (#14b8a6) - Accents
- **Success**: Green - Low risk, completed states
- **Warning**: Orange - Medium risk
- **Error**: Red - High risk, errors

### Animations
- ✨ Smooth page transitions
- 📊 Animated progress bars
- 🔄 Loading spinners
- 💫 Hover effects
- 🎯 Step-by-step indicators

### Components
- **Dashboard**: Statistics cards, charts, recent workflows
- **Workflow Page**: File upload, processing animation, logs
- **Results Page**: Data tables, risk indicators, detailed views

---

## 🔧 Development

### Frontend Development
```bash
cd ok/frontend
npm install
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development (Optional)
```bash
cd ok/backend
npm install
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm start            # Run production build
```

---

## 📝 Available Scripts

### Frontend
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

### Backend
```bash
npm run dev          # Start with hot reload (port 8080)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled JavaScript
npm run lint         # Run ESLint
```

---

## 🐛 Troubleshooting

### CSS Not Loading
```bash
cd ok/frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.ts
```

### Results Not Showing
```bash
# Ensure CSV is in public folder
cp frontend/assets/final_score.csv frontend/public/assets/
```

### Module Not Found
```bash
# Reinstall dependencies
cd ok/frontend
rm -rf node_modules
npm install
```

---

## 🔒 Security Features (Production Ready)

The architecture supports:
- **End-to-end encryption** - Client-side encryption before upload
- **TEE Execution** - Confidential computing environment
- **Zero-trust architecture** - No plaintext data exposure
- **Signed URLs** - Time-limited secure access
- **Audit logging** - Complete activity tracking
- **Multi-party approval** - Collaborative workflows

*Note: Demo mode simulates these features for demonstration purposes.*

---

## 📈 Future Enhancements

- [ ] Connect real backend API
- [ ] Implement user authentication
- [ ] Add real-time WebSocket updates
- [ ] Deploy to cloud (Vercel/Netlify)
- [ ] Add more ML models
- [ ] Export to PDF reports
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced filtering
- [ ] Batch processing

---

## 📚 Documentation

- **START_HERE.md** - Quick 2-minute guide
- **QUICK_START.md** - Detailed demo guide
- **SETUP_GUIDE.md** - Complete setup instructions
- **backend/README.md** - Backend documentation
- **frontend/README.md** - Frontend documentation

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Team

Built with ❤️ by **YellowSense Technologies**

---

## 🆘 Support

### Quick Help
- Check browser console (F12) for errors
- Ensure Node.js v18+ is installed
- Clear browser cache (Cmd/Ctrl + Shift + R)
- Try reinstalling dependencies

### Contact
- Email: support@yellowsense.com
- Documentation: https://docs.yellowsense.com
- GitHub Issues: Open an issue for bugs/features

---

## ⭐ Key Highlights

✨ **Beautiful UI** - Modern, responsive design with smooth animations
🚀 **Fast Setup** - Running in minutes with mock data
🔒 **Secure** - Built with confidential computing principles
📊 **Analytics** - Rich visualizations and insights
🎯 **Production Ready** - Architecture supports real deployment
📱 **Responsive** - Works on all devices
🎨 **Customizable** - Easy to modify colors, themes, and features

---

## 🎉 Get Started Now!

```bash
# Clone or navigate to the project
cd ok/frontend

# Install and run
npm install && npm run dev
```

Then open **http://localhost:3000** and start analyzing! 🚀

---

**Ready to detect fraud patterns securely? Let's go! 🔐**