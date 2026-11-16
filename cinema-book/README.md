# 🎬 CinemaBook - Cinema Hall Ticket Booking System (MERN MVP)

A full-stack Cinema Hall Ticket Booking application built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS, Lucide icons, and JWT authentication.

Designed as a one-day MVP for demonstrating full-stack engineering skills for an internship.

---

## 🌟 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS, React Router v6, Axios, Lucide Icons, React Hot Toast |
| **Backend** | Node.js, Express.js (MVC Architecture) |
| **Database** | MongoDB + Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs password hashing |
| **Language** | JavaScript (ES6+ CommonJS for Server, ESM for Client) |

---

## 🚀 Key Features

### 1. User Authentication & Authorization
- User Registration and Login with bcryptjs password hashing.
- Role-based authorization (`user` vs `admin`).
- JWT-authenticated protected routes on both frontend and backend.
- Quick 1-click **Demo Login** buttons for reviewers (Demo User & Demo Admin).

### 2. Homepage & Discovery
- Premium dark cinema theme with black background and red accents (`#e50914`).
- Featured Premiere hero banner carousel with rating, duration, and synopsis.
- Interactive status filters: **Currently In Theatres (Now Showing)** vs **Upcoming Movies**.
- Real-time genre filtering (Action, Sci-Fi, Drama, Adventure, Animation, etc.) and search by title.

### 3. Movie Details & Showtime Selection
- Comprehensive film overview: high-res backdrop, poster, rating, runtime, director, release date, and top cast.
- Dynamic 5-day showtime selector (Today, Tomorrow, and upcoming dates).
- Theatre listings with screen numbers, showtimes, and starting ticket pricing.

### 4. Interactive Seat Layout & Double-Booking Prevention
- Realistic cinema auditorium layout with curved screen glow (`ALL EYES THIS WAY`).
- Distinct seating tiers:
  - **VIP Premium Recliners** (Rows A & B - ₹350) with golden accents and extra legroom.
  - **Classic Regular Seats** (Rows C through G - ₹200).
- Real-time seat status indicators: Available, Selected (red glow), Booked (disabled).
- **Backend Concurrency Protection**: Seat availability is re-validated on the backend prior to checkout. An atomic MongoDB conditional update (`$addToSet` / `$nin`) prevents race conditions and ensures zero double-booking.

### 5. Mock Payment & Booking Confirmation
- Dynamic order summary calculation (VIP tickets, Regular tickets, convenience fee).
- Interactive Mock Payment modal (Credit/Debit Card, UPI Fast, Net Banking).
- Generates a unique CinemaBook booking ID (`CB-XXXXXX`) and transaction ID (`MOCK-TXN-...`).
- **My Bookings page**: View your past and upcoming reservations with movie details, theatre location, reserved seats, total amount paid, and digital pass download action.

### 6. Admin Management Console
- Protected Admin Dashboard accessible only to `admin` accounts.
- Live statistics cards: Total Revenue, Total Bookings, Movies Catalog, Registered Users.
- Full Movie CRUD:
  - Add new movie with title, description, genres, language, duration, release date, poster URL, banner URL, rating, status.
  - Edit existing movie details.
  - Delete movie with confirmation prompt.
- Customer Bookings Table: Review all tickets reserved across the platform with customer name, movie, theatre, seats, and transaction IDs.
- Schedule Shows Modal: Create new showtimes for any movie and theatre.

---

## 📁 Project Structure

```
cinema-book/
  client/
    public/
      popcorn.svg
    src/
      components/
        Footer.jsx
        HeroBanner.jsx
        MovieCard.jsx
        Navbar.jsx
        PaymentModal.jsx
        PriceSummary.jsx
        ProtectedRoute.jsx
        SeatGrid.jsx
      context/
        AuthContext.jsx
      pages/
        AdminDashboardPage.jsx
        BookingPage.jsx
        HomePage.jsx
        LoginPage.jsx
        MovieDetailsPage.jsx
        MoviesPage.jsx
        MyBookingsPage.jsx
        RegisterPage.jsx
      services/
        api.js
      App.jsx
      index.css
      main.jsx
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
  server/
    src/
      config/
        db.js
      controllers/
        adminController.js
        authController.js
        bookingController.js
        movieController.js
        showController.js
        theatreController.js
      middleware/
        auth.js
        errorHandler.js
      models/
        Booking.js
        Movie.js
        Show.js
        Theatre.js
        User.js
      routes/
        adminRoutes.js
        authRoutes.js
        bookingRoutes.js
        movieRoutes.js
        showRoutes.js
        theatreRoutes.js
      utils/
        seed.js
      app.js
      server.js
    .env
    package.json
  README.md
  .gitignore
```

---

## ⚙️ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection string)

---

### Step 1: Install Server Dependencies
```bash
cd cinema-book/server
npm install
```

### Step 2: Configure Environment Variables
Verify or edit `cinema-book/server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cinemabook
JWT_SECRET=supersecret_cinemabook_jwt_key_2026_secure
NODE_ENV=development
```

### Step 3: Seed Database
Populates movies, theatres, showtimes, and demo credentials:
```bash
npm run seed
```

### Step 4: Install Client Dependencies & Build
```bash
cd ../client
npm install
npm run build
```

### Step 5: Run Application

#### Option A: Unified Full-Stack Run (Express serves built client + API)
```bash
cd ../server
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

#### Option B: Independent Dev Server (Hot Reload)
- Start backend: `cd cinema-book/server && npm run dev` (runs on `http://localhost:5000`)
- Start frontend: `cd cinema-book/client && npm run dev` (runs on `http://localhost:5173`)

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@cinemabook.com` | `admin123` | Full access to Admin Dashboard, Movie CRUD, All Bookings |
| **Demo User** | `user@cinemabook.com` | `user123` | Browse, Select Seats, Mock Payment, My Bookings |

> You can also click the **"Demo User"** or **"Demo Admin"** button on the Login page for 1-click access!

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate & receive JWT
- `GET /api/auth/me` - Get current logged-in profile

### Movies
- `GET /api/movies` - List movies with status, genre, and search filters
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create movie *(Admin only)*
- `PUT /api/movies/:id` - Update movie *(Admin only)*
- `DELETE /api/movies/:id` - Delete movie *(Admin only)*

### Shows & Theatres
- `GET /api/theatres` - List theatres
- `GET /api/shows/movie/:movieId?date=YYYY-MM-DD` - Get shows for a movie
- `GET /api/shows/:id` - Get show layout, booked seats, and prices
- `POST /api/shows` - Schedule new show *(Admin only)*

### Bookings
- `POST /api/bookings` - Create booking with backend seat availability validation & mock payment *(Authenticated)*
- `GET /api/bookings/my-bookings` - Get user's ticket booking history *(Authenticated)*
- `GET /api/bookings/:id` - Get specific booking pass *(Authenticated)*
- `GET /api/bookings` - View all customer bookings *(Admin only)*

### Admin
- `GET /api/admin/stats` - Total revenue, bookings, active movies, users count *(Admin only)*
