# Demo Authentication Credentials

## ✅ Authentication Fixed - Login Required for AI Analysis!

The MongoDB connection timeout issue has been resolved by implementing an in-memory demo authentication system. Users can now register and login without database errors!

**⚠️ IMPORTANT: AI Analysis is now available ONLY to logged-in users!**

## 🔑 Pre-configured Demo Accounts

You can login with these pre-configured accounts:

### Patient Account
- **Email**: patient@demo.com
- **Password**: password123

### Doctor Account
- **Email**: doctor@demo.com
- **Password**: password123

### Admin Account (for dashboard)
- **Email**: admin@demo.com
- **Password**: admin123

## 📝 Registration

You can also **create a new account** by:
1. Go to http://localhost:5173/register
2. Fill out the registration form
3. All new accounts are stored in memory (will be lost on server restart)

## 🔐 Login

To login:
1. Go to http://localhost:5173/login
2. Enter email and password
3. Enter password confirmation (same as password)
4. Click "Login"

## 🧪 Features Available Without Database

### ✅ Working Features:
- ✅ User Registration (in-memory)
- ✅ User Login/Logout
- ✅ Session Management
- ✅ AI Medical Analysis (fully functional)
- ✅ AI Analysis History
- ✅ Protected Routes
- ✅ Dashboard Access

### ⚠️ Limited Features (require real database):
- ⚠️ Appointment Booking
- ⚠️ Message System
- ⚠️ Doctor Management
- ⚠️ Persistent Data Storage

## 🌟 Recommended Testing Flow

1. **Test Registration**: 
   - Visit `/register`
   - Create a new patient account
   - Get automatically logged in

2. **Test Login**:
   - Logout
   - Visit `/login`
   - Login with your created account or use: patient@demo.com / password123

3. **Test AI Analysis (LOGIN REQUIRED)**:
   - **Option 1**: Click "🧠 AI Analysis" in the navigation (redirects to login if not authenticated)
   - **Option 2**: Visit `/dashboard` → Click "AI Analysis" tab
   - Fill out symptom information
   - Get AI-powered medical analysis with personalized recommendations

4. **Test Dashboard**:
   - Visit `/dashboard` (requires login)
   - View patient overview
   - Access AI Analysis feature

## 🔒 Protected Features

**AI Medical Analysis is now AUTHENTICATION-PROTECTED:**
- ✅ Users MUST be logged in to access AI analysis
- ✅ If not logged in, users are redirected to the login page
- ✅ Navigation shows a lock icon (🔒) when not authenticated
- ✅ Analysis history is saved per user session

## 🎯 Quick Start

1. Backend is running at: http://localhost:4000
2. Frontend is running at: http://localhost:5173

### Try It Now:
```
1. Open: http://localhost:5173
2. Click "LOGIN" or "REGISTER"
3. Use patient@demo.com / password123 for quick access
4. After login, click "🧠 AI Analysis" to access the AI medical analysis
```

## 💡 Notes

- All user data is stored in memory and will be lost when the server restarts
- This is a demo/development setup - in production, you would use a real MongoDB database
- The AI Analysis feature works perfectly with the Groq API (Llama 3.3 70B model)
- No database connection errors will appear for authentication operations

## 🔧 Technical Details

**Demo Authentication System**:
- In-memory user storage using JavaScript Map
- JWT token-based authentication
- Cookie-based session management
- All authentication endpoints suffixed with `-demo`

**API Endpoints Added**:
- POST `/api/v1/user-demo/patient/register-demo` - Register new patient
- POST `/api/v1/user-demo/login-demo` - Login (patient/doctor/admin)
- GET `/api/v1/user-demo/patient/logout-demo` - Logout patient
- GET `/api/v1/user-demo/patient/me-demo` - Get patient info
- GET `/api/v1/user-demo/admin/logout-demo` - Logout admin
- GET `/api/v1/user-demo/admin/me-demo` - Get admin info

Enjoy testing the application! 🎉
