# Frontend Deployment Instructions (Netlify)

This document provides step-by-step instructions for deploying the React frontend of the **EstatePro** website to Netlify.

## Prerequisites
- A Netlify account ([Sign up here](https://app.netlify.com/signup))
- Your project pushed to a GitHub repository

## Deployment Steps

1. **Log in to Netlify**: Go to [app.netlify.com](https://app.netlify.com).
2. **Add New Site**: Click on the **"Add new site"** button and select **"Import an existing project"**.
3. **Connect to Git Provider**: Select **GitHub** and authorize Netlify to access your repositories.
4. **Select Repository**: Search for and select your `estate-pro` (or relevant) repository.
5. **Configure Build Settings**:
   - **Base directory**: `frontend` (If your repo contains both backend and frontend).
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Environment Variables**:
   - Click on **"Show advanced"** or go to **Site settings > Environment variables** after creation.
   - Add `VITE_API_URL`: `https://your-backend-url.onrender.com/api` (Replace with your actual Render backend URL).
7. **Deploy Site**: Click **"Deploy site"**.
8. **Handling Redirects (Important)**:
   - Since this is a Single Page Application (SPA), you need a `_redirects` file in the `public` folder of your frontend.
   - Content of `frontend/public/_redirects`:
     ```
     /*    /index.html   200
     ```
   - Netlify will automatically use this to handle React Router paths.

## Site Optimization
- Go to **Domain settings** to set up a custom domain.
- Enable **Site Protection (SSL)** (Netlify provides this for free via Let's Encrypt).
