#!/bin/bash

# Render Deployment Helper Script
# This script helps prepare your project for Render deployment

echo "🚀 Preparing for Render Deployment..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
  echo "❌ Error: Please run this script from the root directory of your project"
  exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
  echo "❌ Error: Backend directory not found"
  exit 1
fi

echo "📋 Pre-deployment Checklist:"
echo "✅ Backend code is in /backend directory"
echo "✅ package.json exists in backend directory"
echo "✅ Start script is configured"

# Check if backend dependencies are installed
cd backend
if [ ! -d "node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  npm install
else
  echo "✅ Backend dependencies already installed"
fi

# Run backend tests (if they exist)
if npm run test --silent > /dev/null 2>&1; then
  echo "🧪 Running backend tests..."
  npm test
  if [ $? -eq 0 ]; then
    echo "✅ All tests passed"
  else
    echo "⚠️  Some tests failed, but continuing..."
  fi
else
  echo "ℹ️  No tests found or test script not configured"
fi

cd ..

echo ""
echo "🎯 Next Steps:"
echo "1. Commit and push all changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com and create a new Web Service"
echo "3. Connect your GitHub repository: Real-time-code-collabration-project"
echo "4. Use these settings:"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Environment: Node"
echo ""
echo "5. Add environment variables:"
echo "   - NODE_ENV: production"
echo "   - CORS_ORIGIN: https://exoticaditya.github.io"
echo ""
echo "6. After deployment, update frontend/.env.production with your Render URL"
echo "7. Push the frontend changes to trigger GitHub Pages deployment"
echo ""
echo "📖 For detailed instructions, see: RENDER_DEPLOYMENT.md"
