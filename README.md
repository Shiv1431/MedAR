# MedAR - Medical Education Platform

MedAR is a comprehensive e-learning platform designed specifically for medical education. It connects students with qualified teachers, offering interactive learning experiences through courses, live classes, and 3D anatomy visualization.

## Features

- **User Authentication**
  - Student and Teacher registration with email verification
  - Secure login system with JWT authentication
  - Role-based access control

- **Course Management**
  - Browse and enroll in medical courses
  - Live class scheduling and attendance
  - Course progress tracking

- **Interactive Learning**
  - 3D Anatomy visualization
  - AR (Augmented Reality) features
  - Live video classes

- **Document Verification**
  - Secure document upload for verification
  - Admin approval system for teachers
  - Document status tracking

- **Payment Integration**
  - Secure payment processing with Razorpay
  - Course purchase and enrollment
  - Payment history tracking

- **AI Chatbot Support**
  - 24/7 automated assistance
  - Course and platform information
  - Technical support

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Three.js (for 3D visualization)
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer
- Cloudinary
- Razorpay Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account (for email service)
- Cloudinary account
- Razorpay account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/medlearn.git
cd medlearn
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Environment Setup

### Backend (.env)
Create a `.env` file in the backend directory:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
SMTP_EMAIL=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
```

### Frontend (.env)
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Deployment

### Frontend (Netlify)
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

### Backend (Render/Heroku)
1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Set environment variables
4. Deploy

## API Documentation

### Authentication Endpoints
- POST `/api/student/signup` - Student registration
- POST `/api/teacher/signup` - Teacher registration
- POST `/api/student/login` - Student login
- POST `/api/teacher/login` - Teacher login
- GET `/api/student/verify` - Email verification
- GET `/api/teacher/verify` - Email verification

### Course Endpoints
- GET `/api/course` - Get all courses
- POST `/api/course` - Create new course
- GET `/api/course/:id` - Get course details

### Payment Endpoints
- POST `/api/payment/create` - Create payment
- POST `/api/payment/verify` - Verify payment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, contact:
- Email: shivsingh1309@gmail.com
- Phone: +91 9260932028
- Address: LPU, Jalandhar, Punjab, India

Or create an issue in the repository.

## Authors

- Shiv Singh
- Sankit
- Saral
- Sarab
- Mayank 