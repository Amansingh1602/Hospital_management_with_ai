# 🏥 MediCare Plus Hospital Management System - MERN Stack

> A comprehensive full-stack web application for managing hospital operations including patient registration, appointment booking, doctor management, and administrative functions for MediCare Plus Hospital.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)](https://www.mongodb.com/mern-stack)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4+-green)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Roles](#-user-roles)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Security](#-security)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- HTTP-only cookies for enhanced security
- Role-based access control (Admin, Doctor, Patient)
- Password hashing with bcrypt

### 👨‍💼 Admin Features
- ✅ Add new administrators
- ✅ Register doctors with profile photos
- ✅ View all registered doctors
- ✅ Manage all appointments (approve/reject)
- ✅ View patient messages
- ✅ Complete dashboard with statistics

### 👨‍⚕️ Doctor Features
- ✅ View assigned appointments
- ✅ Update appointment status
- ✅ Profile management with photo
- ✅ Department-wise organization

### 👤 Patient Features
- ✅ Patient registration
- ✅ Appointment booking
- ✅ Select preferred doctor and department
- ✅ View appointment status
- ✅ Send messages/inquiries
- ✅ **AI-powered symptom analysis** (NEW)
- ✅ **Medical triage recommendations** (NEW)
- ✅ **Analysis history tracking** (NEW)

### 📅 Appointment Management
- ✅ Book appointments with specific doctors
- ✅ Department selection
- ✅ Status tracking (Pending/Accepted/Rejected)
- ✅ Visit tracking
- ✅ Date scheduling

### 💬 Communication
- ✅ Contact form for inquiries
- ✅ Message management
- ✅ Patient-hospital communication

### 🤖 AI-Powered Medical Triage (NEW)
- ✅ Intelligent symptom analysis using Grok AI (Llama 3.3 70B model)
- ✅ Real-time medical triage assessment (Emergency/Urgent/Scheduled/Self-care)
- ✅ Personalized health recommendations based on symptoms
- ✅ OTC medication suggestions with dosage and precautions
- ✅ Home remedy recommendations
- ✅ Dietary advice based on condition
- ✅ Doctor specialization recommendations
- ✅ Emergency contact information
- ✅ Follow-up guidance and when to seek medical attention
- ✅ Confidence scoring for AI predictions
- ✅ Analysis history tracking
- ✅ Age, gender, and condition-specific recommendations
- ✅ Pregnancy-safe medical guidance

### 🗂️ File Management
- ✅ Doctor profile photo uploads
- ✅ Cloudinary integration for image storage
- ✅ Secure file handling

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **AI Integration:** Grok AI (Groq API) with Llama 3.3 70B model
- **File Upload:** express-fileupload
- **Cloud Storage:** Cloudinary
- **Security:** bcrypt, CORS, cookie-parser
- **Validation:** validator.js

### Frontend (Patient Portal)
- **Library:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Carousel:** React Multi Carousel
- **Icons:** React Icons

### Dashboard (Admin/Doctor)
- **Library:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Icons:** React Icons

---

## 👥 User Roles

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **Admin** | Full Access | Manage doctors, approve appointments, view all data |
| **Doctor** | Limited | View assigned appointments, update visit status |
| **Patient** | Basic | Book appointments, view own records |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas account) - [Get Started](https://www.mongodb.com/)
- **Cloudinary Account** (Free tier) - [Sign Up](https://cloudinary.com/)
- **Grok API Key** (Optional, for AI medical triage) - [Get API Key](https://console.groq.com/)

### Installation

#### Windows (Automated)

```bash
# Clone the repository
git clone <your-repo-url>
cd hospital-management-system

# Install all dependencies
install.bat

# Configure environment variables
# Edit backend/config.env with your credentials

# Start all servers
start.bat
```

#### Manual Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install dashboard dependencies
cd ../dashboard
npm install
```

### Configuration

1. **Edit `backend/config.env`:**

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/hospital_management
# OR for Atlas: mongodb+srv://user:pass@cluster.mongodb.net/hospital_management

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key
JWT_EXPIRES=7d
COOKIE_EXPIRE=7

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Grok AI Configuration (for Medical Triage)
GROK_API_KEY=your_grok_api_key_here

# Frontend URLs
FRONTEND_URL_ONE=http://localhost:5173
FRONTEND_URL_TWO=http://localhost:5174

# Server Port
PORT=4000
```

2. **Start MongoDB:**

```bash
# Windows
net start MongoDB

# Or check with
check-mongodb.bat
```

3. **Run the application:**

```bash
# Terminal 1 - Backend (port 4000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev

# Terminal 3 - Dashboard (port 5174)
cd dashboard
npm run dev
```

### Access the Application

- **Patient Portal:** http://localhost:5173
- **Admin Dashboard:** http://localhost:5174
- **Backend API:** http://localhost:4000

---

## 📚 Documentation

Comprehensive documentation is available:

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[CHECKLIST.md](CHECKLIST.md)** - Step-by-step setup checklist
- **[REQUIRED_CREDENTIALS.md](REQUIRED_CREDENTIALS.md)** - API keys and credentials guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flow
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview
- **[VISUAL_GUIDE.md](VISUAL_GUIDE.md)** - Visual representation of the system

---

## 📁 Project Structure

```
hospital-management-system/
│
├── backend/                    # Node.js/Express API
│   ├── controller/             # Business logic
│   ├── database/               # DB connection
│   ├── middlewares/            # Auth & error handling
│   ├── models/                 # Mongoose schemas
│   ├── router/                 # API routes
│   ├── utils/                  # Helper functions
│   ├── app.js                  # Express app
│   ├── server.js               # Entry point
│   └── config.env              # Environment variables
│
├── frontend/                   # Patient Portal (React)
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── Pages/              # Page components
│   │   └── App.jsx
│   └── package.json
│
├── dashboard/                  # Admin/Doctor Portal (React)
│   ├── src/
│   │   └── components/         # Dashboard components
│   └── package.json
│
├── Documentation/
│   ├── SETUP_GUIDE.md
│   ├── ARCHITECTURE.md
│   └── ...
│
├── install.bat                 # Automated installation
├── start.bat                   # Start all servers
├── check-mongodb.bat           # Check MongoDB status
└── README.md                   # This file
```

---

## 📡 API Endpoints

### User Routes (`/api/v1/user/`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/patient/register` | Public | Register new patient |
| POST | `/login` | Public | User login |
| GET | `/patient/logout` | Patient | Logout patient |
| GET | `/admin/logout` | Admin | Logout admin |
| POST | `/admin/addnew` | Admin | Add new admin |
| POST | `/doctor/addnew` | Admin | Add new doctor |
| GET | `/doctors` | Public | Get all doctors |
| GET | `/patient/me` | Patient | Get patient details |
| GET | `/admin/me` | Admin | Get admin details |

### Appointment Routes (`/api/v1/appointment/`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/post` | Patient | Book appointment |
| GET | `/getall` | Admin | Get all appointments |
| PUT | `/update/:id` | Admin | Update appointment |
| DELETE | `/delete/:id` | Admin | Delete appointment |

### Message Routes (`/api/v1/message/`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/send` | Public | Send message |
| GET | `/getall` | Admin | Get all messages |

### AI Analysis Routes (`/api/v1/ai/`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/analyze` | Patient | Analyze symptoms and get medical triage |
| GET | `/history` | Patient | Get user's analysis history |
| GET | `/check-config` | Public | Check AI service configuration status |

---

## 🤖 AI Medical Triage System

### Overview

The AI-powered medical triage system helps patients get immediate health guidance based on their symptoms. It uses advanced AI (Grok/Groq API with Llama 3.3 70B model) to analyze symptoms and provide comprehensive medical recommendations.

### Key Features

#### 1. **Intelligent Symptom Analysis**
- Natural language processing of symptom descriptions
- Considers severity, duration, onset, and patient demographics
- Takes into account existing conditions, medications, and allergies
- Special handling for vulnerable populations (children, elderly, pregnant)

#### 2. **Smart Triage Levels**
The AI categorizes cases into four priority levels:

| Level | Description | Response Time | Color Code |
|-------|-------------|---------------|------------|
| 🔴 **Emergency** | Life-threatening symptoms | Immediate (Call 112) | Red |
| 🟠 **Urgent Visit** | Serious symptoms | Within 24 hours | Orange |
| 🟡 **See Doctor** | Moderate symptoms | Schedule appointment soon | Yellow |
| 🟢 **Self Care** | Minor symptoms | Manageable at home | Green |

#### 3. **Comprehensive Recommendations**

The AI provides:

- **Possible Conditions**: List of potential diagnoses with confidence scores
- **OTC Medications**: Specific over-the-counter medicines with:
  - Exact dosages and frequency
  - Evidence level (Strong/Moderate/Supportive)
  - Safety precautions and contraindications
- **Home Remedies**: Evidence-based natural treatments
- **What to Do**: Step-by-step action items
- **What NOT to Do**: Important warnings and precautions
- **Dietary Advice**: Nutrition recommendations for faster recovery
- **Doctor Specialization**: Which type of doctor to consult
- **Emergency Contacts**: Local emergency numbers with descriptions

#### 4. **Safety Features**

- ✅ **Age-based recommendations**: Tailored advice for children, adults, and elderly
- ✅ **Pregnancy safety**: Automatic escalation and pregnancy-safe recommendations
- ✅ **Drug interaction checks**: Considers current medications
- ✅ **Allergy awareness**: Avoids contraindicated treatments
- ✅ **Conservative approach**: When in doubt, escalates triage level
- ✅ **Emergency detection**: Automatically flags life-threatening symptoms

#### 5. **Analysis History**

- Track all previous symptom analyses
- Review past recommendations
- Monitor health trends over time
- Export analysis reports

### How It Works

```mermaid
graph LR
A[Patient Enters Symptoms] --> B[AI Analysis]
B --> C[Triage Classification]
C --> D[Generate Recommendations]
D --> E[Display Results]
E --> F[Save to History]
```

1. **Patient Input**: User enters symptoms with severity, demographics, and medical history
2. **AI Processing**: Grok AI (Llama 3.3 70B) analyzes the data using medical knowledge
3. **Triage Decision**: Assigns priority level based on urgency
4. **Recommendations**: Generates personalized medical guidance
5. **Follow-up**: Provides clear next steps and when to seek help

### Example Analysis

**Input:**
```
Symptoms: Persistent headache, mild fever, fatigue
Severity: Moderate
Age: 35, Gender: Male
Duration: 2 days
```

**AI Output:**
- **Triage Level**: See Doctor (Yellow)
- **Possible Conditions**: Viral infection, Tension headache, Sinusitis
- **Medicines**: Acetaminophen 500mg every 6 hours, stay hydrated
- **Home Remedies**: Rest in dark room, cold compress, steam inhalation
- **Doctor**: General Physician or ENT Specialist
- **Follow-up**: If fever exceeds 102°F or symptoms worsen, seek immediate care

### Technical Implementation

- **Backend**: Express.js API endpoint at `/api/v1/ai/analyze`
- **AI Model**: Llama 3.3 70B via Groq API
- **Authentication**: JWT-protected, requires patient login
- **Response Time**: < 5 seconds average
- **Fallback**: Graceful degradation if AI service unavailable
- **Storage**: In-memory session storage (can be extended to MongoDB)

### Configuration

Add to `backend/config.env`:
```env
GROK_API_KEY=your_grok_api_key_here
```

Get your free API key from [Groq Console](https://console.groq.com/)

### Medical Disclaimer

⚠️ **Important**: This AI tool is for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.

---

## 🖼️ Screenshots

### Patient Portal
- Home page with hero section
- Department showcase
- Appointment booking form
- Patient registration
- Contact form
- **AI Symptom Analyzer** (NEW)

### Admin Dashboard
- Statistics overview
- Appointment management
- Doctor management
- Add new doctor with photo
- Message inbox

---

## 🔒 Security Features

### Authentication
- ✅ JWT token-based authentication
- ✅ HTTP-only cookies (prevents XSS)
- ✅ Token expiration (7 days)
- ✅ Secure password hashing (bcrypt, 10 rounds)

### Authorization
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Middleware authentication checks

### Data Protection
- ✅ Input validation (Mongoose validators)
- ✅ Email validation
- ✅ CORS protection
- ✅ Environment variable security

### Best Practices
- ✅ Password never returned in queries
- ✅ Async error handling
- ✅ Secure cookie configuration
- ✅ MongoDB injection prevention

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String (11 digits),
  nic: String (13 digits),
  dob: Date,
  gender: Enum ["Male", "Female"],
  password: String (hashed),
  role: Enum ["Patient", "Doctor", "Admin"],
  doctorDepartment: String,
  docAvatar: { public_id, url }
}
```

### Appointment Collection
```javascript
{
  firstName, lastName, email, phone, nic,
  dob, gender, appointment_date,
  department: String,
  doctor: { firstName, lastName },
  doctorId: ObjectId,
  patientId: ObjectId,
  status: Enum ["Pending", "Accepted", "Rejected"],
  hasVisited: Boolean,
  address: String
}
```

### Message Collection
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  message: String
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Patient registration works
- [ ] User login/logout works
- [ ] Admin can add doctors
- [ ] Doctor photo uploads to Cloudinary
- [ ] Patient can book appointments
- [ ] Admin can approve/reject appointments
- [ ] Messages are stored and viewable
- [ ] JWT authentication works
- [ ] Role-based access is enforced

### API Testing

Use tools like:
- **Thunder Client** (VS Code extension)
- **Postman**
- **cURL**

---

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in config.env

2. **Port Already in Use**
   ```bash
   taskkill /F /IM node.exe
   ```

3. **CORS Errors**
   - Verify frontend URLs in config.env
   - Check backend is running first

4. **Cloudinary Upload Fails**
   - Verify credentials in config.env
   - Check file size limits

For more issues, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🚧 Future Enhancements

- [x] ✅ AI-powered symptom analysis and medical triage (COMPLETED)
- [ ] Enhanced AI with medical image analysis
- [ ] Multi-language support for AI recommendations
- [ ] Integration with wearable health devices
- [ ] Health Records (EHR) system
- [ ] Medical report uploads (PDF, images)
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Payment integration
- [ ] Video consultations
- [ ] Prescription management
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] AI-powered appointment scheduling
- [ ] Voice-enabled symptom input

---

## 👨‍💻 Development

### File Watch Mode

All development servers run with hot reload:

```bash
# Backend (nodemon)
cd backend
npm run dev

# Frontend (Vite HMR)
cd frontend
npm run dev

# Dashboard (Vite HMR)
cd dashboard
npm run dev
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Dashboard
cd dashboard
npm run build
```

---

## 📝 Environment Variables

Required environment variables in `backend/config.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend port | `4000` |
| `MONGO_URI` | MongoDB connection | `mongodb://localhost:27017/...` |
| `JWT_SECRET_KEY` | JWT secret | `your_secret_key` |
| `JWT_EXPIRES` | Token expiry | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | `abcdef...` |
| `GROK_API_KEY` | Grok AI API key for medical triage | `gsk_...` |
| `FRONTEND_URL_ONE` | Patient portal URL | `http://localhost:5173` |
| `FRONTEND_URL_TWO` | Dashboard URL | `http://localhost:5174` |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- MongoDB for excellent NoSQL database
- Cloudinary for image hosting
- React team for amazing UI library
- Express.js for robust backend framework
- All open-source contributors

---

## 📞 Support

Need help? Check out:

1. [Documentation](SETUP_GUIDE.md)
2. [Troubleshooting Guide](TROUBLESHOOTING.md)
3. [Visual Guide](VISUAL_GUIDE.md)

---

## 🌟 Project Status

**Status:** ✅ Ready for Local Development

**Version:** 1.0.0

**Last Updated:** December 21, 2025

---

## 💡 Quick Tips

- Always start MongoDB before the backend
- Backend must run before frontend/dashboard
- Clear cookies if authentication fails
- Check console logs for debugging
- Use `check-mongodb.bat` to verify database

---

Made with ❤️ using MERN Stack

**[⬆ Back to top](#-hospital-management-system---mern-stack)**
