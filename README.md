# HamroCinema

HamroCinema is a modern, enterprise-grade cinema booking and management platform. It features a responsive React frontend and a secure Django REST Framework backend, supporting both customer ticketing and administrative management.

## Features

- **Customer Portal**: Browse movies, view showtimes, and book tickets using a visually rich, interactive seat map.
- **Admin Dashboard**: Manage movies, showtimes, theater screens, and user accounts.
- **Secure Authentication**: Distinct role-based portals for customers and administrators with JWT authentication.
- **Loyalty System**: Earn and spend loyalty points on ticket purchases securely.
- **Payment Integration**: Supports eSewa digital wallet for seamless checkout.
- **Enterprise Design**: Built with Tailwind CSS, utilizing a premium dark-mode aesthetic with flat, semantic color palettes.

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **State/Routing**: React Router, Context API
- **HTTP Client**: Axios

### Backend
- **Framework**: Django & Django REST Framework
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Authentication**: JWT (Simple JWT)
- **Payment Processing**: eSewa API

---

## Local Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Apply migrations**:
   ```bash
   python manage.py migrate
   ```
5. **Create a superuser (Admin)**:
   ```bash
   python manage.py createsuperuser
   ```
6. **Start the development server**:
   ```bash
   python manage.py runserver
   ```
   *The API will be available at `http://127.0.0.1:8000/`*

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173/`*

---

## Project Structure

- `/frontend`: React/Vite application.
- `/backend`: Django project housing the API and admin tools.
- `/backend/cinema`: Core Django app handling logic, models, and endpoints.
