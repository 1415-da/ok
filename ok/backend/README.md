# Confidential Clean Room Backend (TypeScript)

A secure, production-ready backend for confidential computing clean rooms built with TypeScript, Express, and Google Cloud Platform.

## 🚀 Features

- **Workflow Management** - Create, approve, and execute secure collaborative workflows
- **Encrypted Data Handling** - Client-side encryption with TEE execution
- **Google Cloud Integration** - BigQuery for metadata, Cloud Storage for encrypted assets
- **Signed URLs** - Secure file upload/download with time-limited access
- **Real-time Logging** - Monitor workflow execution in real-time
- **Dashboard Analytics** - Comprehensive statistics and insights
- **Type Safety** - Full TypeScript implementation with strict typing

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Google Cloud Platform** account with:
  - BigQuery API enabled
  - Cloud Storage API enabled
  - Service account with appropriate permissions

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd ok/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Add your Google Cloud credentials**
   - Download service account JSON key from GCP Console
   - Save as `service-account-key.json` in the backend root
   - Update `.env` with your GCP project details

## ⚙️ Configuration

Edit `.env` file with your settings:

```env
# Server
PORT=8080
NODE_ENV=development

# Google Cloud
GCP_PROJECT_ID=your-project-id
GCP_DATASET=cleanroom
GCP_BUCKET=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# Executor Service
EXECUTOR_URL=http://localhost:8443

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic & external services
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Application entry point
├── uploads/             # Temporary file storage
├── temp/               # Temporary working directory
├── .env                # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🚦 Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Other Scripts
```bash
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Workflow Management

#### Create Workflow
```http
POST /api/workflows
Content-Type: application/json

{
  "workflow_id": "unique-id",
  "creator": "user-id",
  "collaborators": ["user1", "user2"]
}
```

#### Get Workflow
```http
GET /api/workflows/:workflow_id?creator=user-id
```

#### Approve Workflow
```http
POST /api/workflows/:workflow_id/approve?client_id=user-id
```

#### Run Workflow
```http
POST /api/workflows/:workflow_id/run?creator=user-id&collaborators=user1,user2
```

#### Get Workflow Results
```http
GET /api/workflows/:workflow_id/result
```

#### Get Workflow Logs
```http
GET /api/logs/:workflow_id
```

#### Get All Workflows
```http
GET /api/workflows?user_id=user-id
```

### Storage Management

#### Generate Upload URL
```http
POST /api/upload-url?workflow_id=xxx&dataset_id=xxx&filename=data.csv&file_type=dataset&owner=user-id
```

#### Generate Download URL
```http
GET /api/download-url?gcs_path=gs://bucket/path/to/file
```

#### Get Executor Public Key
```http
GET /api/executor-pubkey
```

#### Direct File Upload
```http
POST /api/upload
Content-Type: multipart/form-data

file: [binary data]
workflow_id: xxx
dataset_id: xxx
file_type: dataset
owner: user-id
```

### Dashboard

#### Get Statistics
```http
GET /api/dashboard/stats?user_id=user-id
```

## 🔒 Security Features

- **CORS Protection** - Configurable allowed origins
- **Input Validation** - Request validation for all endpoints
- **Signed URLs** - Time-limited access to storage
- **Service Account Auth** - Secure GCP authentication
- **Error Handling** - Comprehensive error management
- **Request Logging** - Audit trail for all requests

## 🗄️ BigQuery Schema

### Workflows Table (`{user}_workflows`)
```sql
workflow_id STRING
creator STRING
collaborator ARRAY<STRING>
workload_path STRING
status STRING
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Approvals Table (`{user}_workflow_approvals`)
```sql
workflow_id STRING
approver STRING
approved BOOLEAN
approved_at TIMESTAMP
```

### Datasets Table (`{user}_datasets`)
```sql
dataset_id STRING
workflow_id STRING
owner STRING
filename STRING
gcs_path STRING
created_at TIMESTAMP
```

### Keys Table (`{user}_keys`)
```sql
dataset_id STRING
workflow_id STRING
owner STRING
gcs_path STRING
created_at TIMESTAMP
```

### Results Table (`results`)
```sql
id STRING
workflow_id STRING
executed_notebook_path STRING
result_path STRING
created_at TIMESTAMP
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

The backend provides comprehensive logging:

- **Request Logging** - All incoming requests
- **Error Logging** - Detailed error information with stack traces
- **Workflow Execution** - Real-time execution logs
- **Performance Metrics** - Response times and resource usage

## 🐛 Troubleshooting

### Common Issues

1. **GCP Authentication Error**
   - Ensure service account JSON is in the correct location
   - Verify service account has necessary permissions
   - Check `GOOGLE_APPLICATION_CREDENTIALS` path in `.env`

2. **BigQuery Table Not Found**
   - Tables are created automatically on first insert
   - Ensure dataset exists in BigQuery
   - Check GCP project ID and dataset name in config

3. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill process using the port: `lsof -ti:8080 | xargs kill`

4. **Upload Directory Errors**
   - Directories are created automatically on startup
   - Ensure write permissions in backend folder

5. **CORS Errors**
   - Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
   - Restart backend after config changes

## 🔄 Development Workflow

1. **Make changes** to TypeScript files
2. **Hot reload** automatically compiles and restarts
3. **Check logs** in terminal for errors
4. **Test endpoints** using Postman or curl
5. **Build** for production before deploying

## 🚀 Deployment

### Docker (Recommended)
```bash
docker build -t cleanroom-backend .
docker run -p 8080:8080 --env-file .env cleanroom-backend
```

### Cloud Run
```bash
gcloud run deploy cleanroom-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### VM or Kubernetes
- Build the application: `npm run build`
- Copy `dist/` folder and `node_modules/` to server
- Set environment variables
- Run: `node dist/index.js`

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment mode | `development` |
| `GCP_PROJECT_ID` | Google Cloud project ID | - |
| `GCP_DATASET` | BigQuery dataset name | `cleanroom` |
| `GCP_BUCKET` | Cloud Storage bucket | - |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON | `./service-account-key.json` |
| `EXECUTOR_URL` | TEE executor service URL | `http://localhost:8443` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000` |
| `MAX_FILE_SIZE` | Max upload file size in bytes | `10485760` (10MB) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@yellowsense.com
- Documentation: https://docs.yellowsense.com

## 🎯 Roadmap

- [ ] Add authentication and authorization
- [ ] Implement rate limiting
- [ ] Add WebSocket support for real-time updates
- [ ] Enhanced monitoring and metrics
- [ ] API versioning
- [ ] Comprehensive test coverage
- [ ] API documentation with Swagger/OpenAPI

---

Built with ❤️ by YellowSense Technologies