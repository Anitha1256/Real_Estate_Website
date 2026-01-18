# Backend Deployment Instructions (Render)

This document provides step-by-step instructions for deploying the Node.js/Express backend of the **EstatePro** website to Render.

## Prerequisites
- A Render account ([Sign up here](https://render.com/register))
- A MongoDB Atlas database URI ([Create one here](https://www.mongodb.com/cloud/atlas/register))
- Your project pushed to a GitHub repository

## Deployment Steps

1. **Log in to Render**: Go to [dashboard.render.com](https://dashboard.render.com).
2. **New Web Service**: Click **"New"** and select **"Web Service"**.
3. **Connect Repository**: Connect your GitHub account and select your repository.
4. **Configure Service**:
   - **Name**: `estate-pro-backend`
   - **Environment**: `Node`
   - **Region**: Select the one closest to your users.
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. **Environment Variables**:
   - Click **"Advanced"** and add the following variables:
     - `MONGO_URI`: (Your MongoDB Atlas Connection String)
     - `JWT_SECRET`: (A long random string for security)
     - `PORT`: `5000` (Render will override this, but good to have)
     - `NODE_ENV`: `production`
6. **Deploy**: Click **"Create Web Service"**.

## Post-Deployment
- Render will provide a URL like `https://estate-pro-backend.onrender.com`.
- Copy this URL and update the `VITE_API_URL` in your Netlify (frontend) environment variables.
- Make sure to allow Render's IP or "Allow access from anywhere" (0.0.0.0/0) in your MongoDB Atlas Network Access settings.
