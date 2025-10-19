# Confidential Clean Room Frontend (React + TypeScript)

A modern, beautiful frontend application for confidential computing clean rooms built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX** - Beautiful, responsive design with smooth animations
- **Dashboard Analytics** - Real-time statistics and visualizations
- **Secure File Upload** - Drag-and-drop interface for dataset uploads
- **Live Processing** - Real-time workflow execution monitoring
- **Results Visualization** - Interactive data tables and metrics display
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Type Safety** - Full TypeScript implementation
- **Performance Optimized** - Code splitting and lazy loading

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**
- Backend API running on `http://localhost:8080`

## 🛠️ Installation

1. **Navigate to frontend directory**
   ```bash
   cd ok/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your settings**
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

## 🚦 Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start on `http://localhost:3000`

### Production Build
```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📂 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, CSV files, etc.
│   ├── components/     # Reusable React components
│   │   └── Layout.tsx  # Main layout wrapper
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx      # Dashboard with stats
│   │   ├── WorkflowPage.tsx   # Workflow creation & execution
│   │   └── ResultsPage.tsx    # Results visualization
│   ├── services/       # API services
│   │   └── api.ts      # API client & methods
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.js  # Tailwind CSS config
├── vite.config.ts      # Vite config
└── README.md
```

## 🎨 Key Technologies

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Data & State
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **Papa Parse** - CSV parsing

### Utilities
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization
- **date-fns** - Date utilities
- **uuid** - UUID generation

## 🎯 Main Features

### Dashboard Page (`/dashboard`)
- Real-time workflow statistics
- Activity charts and graphs
- Recent workflows list
- Quick action cards
- Status distribution visualization

### Workflow Page (`/workflow`)
- File upload interface for accounts and transactions data
- Real-time encryption and upload progress
- Step-by-step processing visualization
- Live execution logs
- Automatic redirect to results on completion

### Results Page (`/results/:workflowId`)
- Display all workflow result files
- CSV data preview in tables
- Metrics displayed as cards
- Download functionality
- Analysis summary

## 🔌 API Integration

The frontend communicates with the backend API through the `api.ts` service:

### Available API Methods

```typescript
// Workflows
api.workflows.create(data)
api.workflows.get(workflowId, creator)
api.workflows.getAll(userId)
api.workflows.approve(workflowId, clientId)
api.workflows.run(workflowId, creator, collaborators)
api.workflows.getResults(workflowId)
api.workflows.getLogs(workflowId)

// Storage
api.storage.generateUploadUrl(params)
api.storage.generateDownloadUrl(gcsPath)
api.storage.uploadToSignedUrl(url, data)
api.storage.getExecutorPubkey()

// Dashboard
api.dashboard.getStats(userId)
```

## 🎨 Customization

### Tailwind Configuration

Edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Animations
- Breakpoints

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080/api` |
| `VITE_APP_NAME` | Application name | `YellowSense Confidential Clean Room` |
| `VITE_ENABLE_DEBUG` | Enable debug mode | `true` |
| `VITE_MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` (10MB) |
| `VITE_API_TIMEOUT` | API timeout (ms) | `600000` (10 min) |

## 🧪 Development Workflow

### Adding a New Page

1. Create component in `src/pages/`:
   ```typescript
   // src/pages/NewPage.tsx
   export default function NewPage() {
     return <div>New Page Content</div>;
   }
   ```

2. Add route in `src/App.tsx`:
   ```typescript
   <Route path="/new-page" element={<NewPage />} />
   ```

3. Add navigation link in `src/components/Layout.tsx`

### Adding a New API Endpoint

1. Add method to `src/services/api.ts`:
   ```typescript
   api.myNewEndpoint = {
     getData: async () => {
       const response = await apiClient.get('/my-endpoint');
       return response.data;
     }
   }
   ```

2. Use in component:
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ['myData'],
     queryFn: () => api.myNewEndpoint.getData(),
   });
   ```

## 🎯 Component Guidelines

### File Upload Component
- Drag-and-drop support
- File type validation
- Progress indication
- Error handling

### Data Table Component
- Sortable columns
- Pagination
- Search/filter
- Export functionality

### Chart Component
- Responsive design
- Interactive tooltips
- Custom colors
- Loading states

## 🚀 Performance Optimization

### Code Splitting
The app automatically splits code by route using React Router's lazy loading.

### Asset Optimization
- Images are optimized during build
- Fonts are preloaded
- CSS is minified
- JS is bundled and compressed

### Build Output
```bash
npm run build
```

Output in `dist/` folder:
- Optimized HTML
- Minified JS bundles
- Compressed CSS
- Static assets

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Hamburger menu
- Touch-optimized interactions
- Responsive tables
- Adaptive charts

## 🎨 UI/UX Features

### Animations
- Page transitions
- Loading states
- Micro-interactions
- Smooth scrolling

### Accessibility
- Keyboard navigation
- ARIA labels
- Focus indicators
- Screen reader support

### Dark Mode (Coming Soon)
Prepared for dark mode implementation with Tailwind's dark mode utilities.

## 🔒 Security Features

- Input validation
- XSS protection
- CSRF token support (when backend provides)
- Secure file upload
- API request signing

## 📊 Data Visualization

### Charts Available
- Line charts (workflow activity)
- Bar charts (performance metrics)
- Pie charts (status distribution)
- Area charts (trend analysis)

### Libraries Used
- **Recharts** - Composable charting library
- Custom styling to match design system

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure backend is running on correct port
   - Check `VITE_API_URL` in `.env`
   - Verify CORS settings on backend

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Vite cache: `rm -rf node_modules/.vite`
   - Update dependencies: `npm update`

3. **Hot Reload Not Working**
   - Restart dev server
   - Check file watcher limits (Linux)
   - Disable browser extensions

4. **TypeScript Errors**
   - Run type check: `npm run type-check`
   - Update types: `npm install -D @types/node @types/react`

5. **Styling Issues**
   - Clear Tailwind cache
   - Rebuild: `npm run build`
   - Check class name typos

## 📝 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### Docker
```bash
docker build -t cleanroom-frontend .
docker run -p 3000:3000 cleanroom-frontend
```

### Static Hosting
Upload `dist/` folder to any static hosting service:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- GitHub Pages

## 🔄 Workflow

### Typical User Flow

1. **Login** → Dashboard
2. **Dashboard** → View statistics
3. **New Workflow** → Upload files
4. **Processing** → Monitor progress
5. **Results** → View and download

### File Upload Flow

1. Select files (accounts + transactions)
2. Files are validated
3. Encryption simulation
4. Upload to backend via signed URLs
5. Workflow execution
6. Results displayed

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@yellowsense.com
- Documentation: https://docs.yellowsense.com

## 🎯 Roadmap

- [x] Dashboard with statistics
- [x] Workflow creation and execution
- [x] Results visualization
- [x] Responsive design
- [ ] Dark mode support
- [ ] Advanced filtering
- [ ] Export to PDF
- [ ] Real-time notifications
- [ ] User authentication
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Progressive Web App (PWA)

## 🏆 Best Practices

### Code Style
- Use TypeScript strict mode
- Follow React Hooks best practices
- Implement proper error boundaries
- Use semantic HTML

### Performance
- Lazy load routes
- Optimize images
- Minimize re-renders
- Use React.memo wisely

### Accessibility
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation
- ARIA attributes

---

Built with ❤️ by YellowSense Technologies