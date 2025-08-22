#!/bin/bash

echo "🧪 Validating E-commerce Sample Application..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the samples/ecommerce-app directory"
    exit 1
fi

echo "✅ Directory structure validated"

# Check backend structure
echo "🔍 Checking backend structure..."
if [ ! -f "src/backend/package.json" ]; then
    echo "❌ Backend package.json not found"
    exit 1
fi

if [ ! -f "src/backend/server.js" ]; then
    echo "❌ Backend server.js not found"
    exit 1
fi

echo "✅ Backend structure validated"

# Check frontend structure
echo "🔍 Checking frontend structure..."
if [ ! -f "src/frontend/package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

if [ ! -f "src/frontend/src/App.tsx" ]; then
    echo "❌ Frontend App.tsx not found"
    exit 1
fi

echo "✅ Frontend structure validated"

# Check environment configuration
echo "🔍 Checking environment configuration..."
if [ ! -f ".env.example" ]; then
    echo "❌ .env.example not found"
    exit 1
fi

echo "✅ Environment configuration validated"

# Check documentation
echo "🔍 Checking documentation..."
if [ ! -f "README.md" ]; then
    echo "❌ README.md not found"
    exit 1
fi

if [ ! -f "docs/DEVELOPMENT.md" ]; then
    echo "❌ Development documentation not found"
    exit 1
fi

echo "✅ Documentation validated"

# Validate backend dependencies (if node_modules exists)
if [ -d "src/backend/node_modules" ]; then
    echo "🔍 Validating backend dependencies..."
    cd src/backend
    
    # Test basic imports
    if node -e "
        try {
            require('./utils/logger');
            require('./middleware/errorHandler');
            console.log('✅ Backend modules load successfully');
        } catch (error) {
            console.error('❌ Backend module error:', error.message);
            process.exit(1);
        }
    "; then
        echo "✅ Backend dependencies validated"
    else
        echo "❌ Backend dependencies validation failed"
        exit 1
    fi
    
    cd ../..
else
    echo "⚠️  Backend dependencies not installed - run 'npm run setup' to install"
fi

# Validate frontend TypeScript compilation (if node_modules exists)
if [ -d "src/frontend/node_modules" ]; then
    echo "🔍 Validating frontend TypeScript..."
    cd src/frontend
    
    if npx tsc --noEmit --skipLibCheck; then
        echo "✅ Frontend TypeScript validated"
    else
        echo "❌ Frontend TypeScript validation failed"
        exit 1
    fi
    
    cd ../..
else
    echo "⚠️  Frontend dependencies not installed - run 'npm run setup' to install"
fi

echo ""
echo "🎉 E-commerce Sample Application validation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and configure your Azure Cosmos DB connection"
echo "2. Run 'npm run setup' to install all dependencies"
echo "3. Run 'npm run dev' to start the development servers"
echo ""
echo "For detailed setup instructions, see docs/DEVELOPMENT.md"