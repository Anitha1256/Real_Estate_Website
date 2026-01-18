# EstatePro - Premium Real Estate Management Platform

EstatePro is a full-stack real estate application designed for listing, discovering, and managing premium properties. It features a modern, responsive frontend and a robust backend API.

## 🚀 Project Overview

The application is built using the MERN stack (MongoDB, Express, React, Node.js) and features:
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile.
- **Search & Filtering**: Advanced property search by location and type.
- **Interactive Map**: Leaflet integration for map-based property discovery.
- **Role-Based Access**:
  - **Seekers**: Browse, search, and inquire about properties.
  - **Agents**: List and manage properties, receive inquiries.
  - **Admins**: Full system oversight, user management, and analytics.

---

## 🛠 Tech Stack

### Frontend (`/frontend`)
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS (Glassmorphism effects)
- **State/Routing**: React Router DOM, Context API
- **Icons/Animations**: Lucide-React, Framer Motion
- **Maps**: React-Leaflet

### Backend (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Image Handling**: Custom image management logic

---

## ⚡️ Quick Start Guide

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm start
```
*Runs on access port `5001` by default.*

#### Environment Variables (`backend/.env`)
Ensure you have a `.env` file in the `backend` folder with:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_for_notifications
EMAIL_PASS=your_email_app_password
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```
*Accessible strictly at `http://localhost:5173`.*

---

## 🔑 Default Admin Credentials

Use these credentials to access the **Admin Dashboard** (`/admin-dashboard`) for full system control.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | **`admin@estatepro.com`** | **`admin123`** |

> **Note**: To seed this admin user into a fresh database, run the seeder script in the backend directory:
> ```bash
> cd backend
> node create_admin.js
> ```

---

## 📂 Project Structure

```
estate-pro/
├── backend/            # Express API & Database Logic
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── create_admin.js # Admin Seeder Script
│   └── package.json
│
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── pages/      # Route Pages (Home, Map, Dashboard)
│   │   └── context/    # Auth & State Contexts
│   └── package.json
└── README.md           # Documentation
```
