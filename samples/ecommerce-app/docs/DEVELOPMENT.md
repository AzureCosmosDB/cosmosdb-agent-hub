# Development Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Azure Cosmos DB account (or use local emulator)

## Quick Start

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd samples/ecommerce-app
   npm run setup
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure Cosmos DB connection details
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

This will start both the backend (port 3001) and frontend (port 3000) in development mode.

## Using Azure Cosmos DB Emulator

For local development, you can use the Azure Cosmos DB Emulator:

1. **Install the emulator:**
   - Download from: https://aka.ms/cosmosdb-emulator
   - Or use Docker: `docker run -p 8081:8081 mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator`

2. **Configure environment variables for emulator:**
   ```bash
   COSMOS_DB_ENDPOINT=https://localhost:8081
   COSMOS_DB_KEY=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
   COSMOS_DB_DATABASE_NAME=ecommerce
   ```

## Docker Development

Use Docker Compose for a complete development environment:

```bash
docker-compose up -d
```

This will start:
- Backend API (http://localhost:3001)
- Frontend application (http://localhost:3000)
- Azure Cosmos DB Emulator (https://localhost:8081)

## Development Workflow

### Backend Development

1. **Navigate to backend directory:**
   ```bash
   cd src/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend Development

1. **Navigate to frontend directory:**
   ```bash
   cd src/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

## API Testing

The backend includes sample data seeding. Once started, you can test the API:

- **Health check:** http://localhost:3001/health
- **Get products:** http://localhost:3001/api/products
- **Search products:** http://localhost:3001/api/products/search?q=headphones

## Debugging

### Backend Debugging
- Logs are output to console in development mode
- Use VS Code debugger with the included launch configuration
- Monitor Azure Cosmos DB requests in the Azure portal

### Frontend Debugging
- Use browser developer tools
- React DevTools extension recommended
- Network tab for API request debugging

## Testing

### Backend Tests
```bash
cd src/backend
npm test
```

### Frontend Tests
```bash
cd src/frontend
npm test
```

## Building for Production

### Backend
```bash
cd src/backend
npm run build
```

### Frontend
```bash
cd src/frontend
npm run build
```

## Deployment

See the deployment documentation for Azure-specific deployment instructions:
- Azure Container Apps
- Azure App Service
- Azure Static Web Apps (frontend only)

## Troubleshooting

### Common Issues

1. **Connection to Cosmos DB fails:**
   - Verify endpoint and key in .env file
   - Check network connectivity
   - Ensure firewall rules allow connections

2. **Frontend can't connect to backend:**
   - Verify REACT_APP_API_URL is set correctly
   - Check CORS configuration in backend

3. **Docker issues:**
   - Ensure Docker daemon is running
   - Check port conflicts (3000, 3001, 8081)
   - Clear Docker cache if build fails

### Getting Help

- Check the GitHub issues for known problems
- Review Azure Cosmos DB documentation
- Use GitHub Copilot with the included instructions for development assistance