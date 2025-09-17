# Render Deployment Configuration
# This file contains instructions and configurations for deploying to Render.com

## Backend Deployment to Render

### Step 1: Prepare your repository
1. Ensure all changes are committed and pushed to GitHub
2. Make sure your backend code is in the `/backend` directory

### Step 2: Create a new Web Service on Render
1. Go to https://render.com and sign up/login
2. Connect your GitHub account
3. Click "New +" → "Web Service"
4. Select your GitHub repository: `Real-time-code-collabration-project`
5. Configure the following settings:

**Basic Settings:**
- **Name:** `realtime-code-backend` (or your preferred name)
- **Region:** Choose the region closest to your users
- **Branch:** `main`
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Advanced Settings:**
- **Node Version:** 18.x (or latest LTS)
- **Auto-Deploy:** Yes (recommended)

### Step 3: Environment Variables
Add these environment variables in Render dashboard:
- `NODE_ENV`: `production`
- `PORT`: `5000` (Render will override this automatically)
- `CORS_ORIGIN`: `https://exoticaditya.github.io` (your GitHub Pages URL)

### Step 4: Configure Health Check (Optional but recommended)
- **Health Check Path:** `/api/health`

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically deploy your backend
3. Note the URL provided by Render (e.g., `https://your-app-name.onrender.com`)

## Frontend Deployment to GitHub Pages

### Step 1: Enable GitHub Pages
1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Set Source to "GitHub Actions"

### Step 2: Update Backend URL
1. Update the GitHub Actions workflow file `.github/workflows/deploy-frontend.yml`
2. Replace `REACT_APP_BACKEND_URL: https://your-app-name.onrender.com` with your actual Render URL

### Step 3: Deploy
1. Push changes to trigger the GitHub Actions workflow
2. Your frontend will be available at: `https://exoticaditya.github.io/Real-time-code-collabration-project`

## Post-Deployment Configuration

### Update CORS Configuration
After getting your Render URL, update the backend CORS configuration:

1. In your backend `src/app.js`, ensure CORS is configured for your GitHub Pages URL:
```javascript
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://exoticaditya.github.io"
  ],
  credentials: true
};
```

### Update Frontend Environment Variables
Update your frontend environment files:

**`.env.production`:**
```
REACT_APP_BACKEND_URL=https://your-actual-render-url.onrender.com
```

## Monitoring and Maintenance

### Health Monitoring
- Render URL: `https://your-app-name.onrender.com/api/health`
- GitHub Pages: Available 24/7 (static hosting)

### Logs and Debugging
- **Render Logs:** Available in Render dashboard under "Logs" tab
- **GitHub Pages:** Check Actions tab for deployment logs

### Scaling
- **Render Free Tier:** Limited resources, spins down after inactivity
- **Render Paid Plans:** Better performance, no spin-down
- **GitHub Pages:** Unlimited bandwidth for public repositories

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure backend CORS includes your GitHub Pages URL
   - Check that URLs don't have trailing slashes

2. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

3. **Connection Issues:**
   - Render free tier spins down after inactivity (causes delays)
   - Consider upgrading to paid plan for production

4. **Environment Variables:**
   - Double-check all environment variables are set correctly
   - Ensure URLs use `https://` for production

## Cost Considerations
- **GitHub Pages:** Free for public repositories
- **Render:** $7/month for basic web service (no spin-down)
- **Total:** $7/month for full-stack deployment

## Alternative Backends
If you prefer other services:
- **Heroku:** Similar setup, $7/month
- **Railway:** Modern alternative, similar pricing
- **Vercel:** Great for Node.js, different pricing model
