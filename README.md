# 🎬 IMovies – Premium Online Movie Ticket Booking Platform

**IMovies** is a full-stack, responsive, and cinematic web application built with **React.js**, **Node.js**, **Express.js**, **MongoDB**, **Tailwind CSS**, and **Socket.IO**. It provides an authentic theater booking experience featuring real-time seat lock synchronization, interactive seat maps, simulated payment gateways, printable digital boarding passes with QR codes, and a comprehensive administrator management console.

---

## 🌟 Key Features

### 1. Cinema-Themed Interface & Discovery
- **Dark Cinema Aesthetic:** Deep navy/black background (`#0A0E17`), vivid red glow accents (`#E50914`), modern typography, and glassmorphic cards.
- **Dynamic Cinematic Hero Banner:** Featured movies carousel with direct trailer playback modal and ticket booking shortcuts.
- **City Selector:** Interactive multi-city switcher (New York, Los Angeles, Chicago, Toronto, London, Mumbai) with persistent local storage.
- **Filterable Movie Sections:** "Now Showing", "Trending Movies", and "Coming Soon" tabs.
- **Full Catalog Search & Filter:** Filter by genre, language, minimum rating, release status, and sort by popularity, rating, release date, or alphabetical order.

### 2. Showtime & Theatre Discovery
- **7-Day Interactive Date Picker:** Real-time date chips (Today, Tomorrow, and the next 5 days).
- **Multi-Cinema Listing:** Cinema details with addresses, available sound formats (IMAX 3D, Dolby Cinema 4K, RealD 3D), and amenities.
- **Showtime Chips:** One-click navigation into the auditorium seating plan.

### 3. Real-Time Interactive Seat Booking & Hold System
- **Tiered Cinema Seating Map:**
  - **VIP Tiers:** Luxury motor recliners.
  - **Premium Tiers:** Upper-middle cinema rocker seats.
  - **Regular Tiers:** Front comfort cinema seating.
- **Dynamic Seat States:** Distinct visual representations for *Available*, *Selected*, *Already Booked* (locked), and *Held by Other User*.
- **Live Seat Hold Synchronization:** Powered by **Socket.IO** rooms (`show:${showId}`). When any user selects a seat, a temporary 10-minute hold is broadcast across all connected clients to prevent duplicate bookings.
- **Atomic MongoDB Seat Reservation:** Double-checked and atomic push reservation prevents race conditions and conflicts.
- **Dynamic Cart Summary:** Dynamic calculation of ticket tiers, optional snack concessions, convenience fees, and taxes with backend price recalculation.

### 4. Digital Boarding Pass & Mock Payment
- **Simulated Payment Gateway:** Supports Card, UPI, and Digital Wallets. Includes a **"Simulate Failure" toggle** to test bank decline handling as requested.
- **Digital Cinema Ticket Pass:** Generates a unique reference (e.g. `IMV-20261027-A9F4`) and scannable QR code.
- **Print & Download:** Dedicated `@media print` layout for borderless boarding pass printing, plus `.txt` digital pass download.

### 5. User Account & Bookings Management
- **JWT Authentication:** Secure bcrypt-hashed passwords and token management.
- **My Bookings Dashboard:** Separate tabs for "Upcoming Shows" and "Past/Cancelled Shows".
- **Hassle-Free Cancellation:** Instant booking cancellation before showtime with automated simulated refund (90%) and immediate real-time seat release back to the theater pool.
- **User Profile:** Manage contact info, view total lifetime bookings and spending statistics.

### 6. Administrator Management Console
- **Platform Analytics:** Total revenue from recorded transactions, total bookings, active movies, and member count.
- **Movie Management:** Add new movies, edit metadata, and delete movies.
- **Screening Scheduler:** Schedule new shows across theaters, screens, and custom pricing tiers.
- **Customer Bookings Oversight:** Search and filter all customer transactions across the platform by Reference ID, customer email, or status.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, React Router v6, Lucide React, Socket.IO Client, Canvas Confetti |
| **Backend** | Node.js (v20+), Express.js, Socket.IO, Helmet, Morgan, CORS, Express Rate Limit, QR Code |
| **Database** | MongoDB with Mongoose (with embedded `mongodb-memory-server` fallback for zero-config local run) |
| **Authentication** | JSON Web Tokens (JWT) & BcryptJS password encryption |

---

## 📁 Project Directory Structure

```
imovies/
├── client/                     # Frontend React (Vite) Application
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Images and design assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── SeatLayout.jsx
│   │   │   ├── BookingSummaryModal.jsx
│   │   │   ├── TicketModal.jsx
│   │   │   ├── TrailerModal.jsx
│   │   │   ├── CityModal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── AlertToast.jsx
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── CityContext.jsx
│   │   ├── pages/              # Application views
│   │   │   ├── HomePage.jsx
│   │   │   ├── MoviesPage.jsx
│   │   │   ├── MovieDetailsPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── BookingSuccessPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/           # REST API & Socket.io client services
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Node.js / Express Application
│   ├── config/
│   │   └── db.js               # Dual MongoDB connection (External URI or In-Memory)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── theatreController.js
│   │   ├── showController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & role authorization
│   │   └── errorMiddleware.js  # Centralized error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theatre.js
│   │   ├── Screen.js
│   │   ├── Show.js
│   │   ├── Booking.js
│   │   └── SeatHold.js         # TTL-indexed seat reservation model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── theatreRoutes.js
│   │   ├── showRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── seed/
│   │   ├── seedData.js         # Curated blockbuster movies and cinemas
│   │   └── seeder.js           # CLI and automatic seeding utility
│   ├── test/
│   │   └── api.test.js         # Backend unit and integration test suite
│   ├── utils/
│   │   ├── bookingReference.js
│   │   └── socketHandler.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── start-dev.bat               # Windows one-click dual launcher
├── package.json                # Root package with unified scripts
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- *(Optional)* A running local MongoDB daemon or MongoDB Atlas connection string. If omitted, IMovies automatically activates its integrated embedded database engine.

---

### 2. Environment Variables Configuration

Copy `.env.example` in the `server/` directory:

```bash
cd server
copy .env.example .env
```

Default variables in `server/.env`:
```env
PORT=5000
NODE_ENV=development

# Leave blank to use integrated embedded MongoDB in development
MONGODB_URI=

# JWT Secrets
JWT_SECRET=imovies_super_secure_jwt_secret_key_2026_cinema
JWT_EXPIRE=30d
```

---

### 3. Installation

From the project root:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 4. Running the Application

You can launch both services using any of the following methods:

#### Method A: Unified One-Click Launcher (Windows)
Double-click `start-dev.bat` in the project root.

#### Method B: Separate Terminals

**Terminal 1 — Backend:**
```bash
cd server
npm start
```
*Output:*
```
🎬 IMovies Server running in development mode on port 5000
🌐 Base URL: http://localhost:5000
⚡ Real-time Socket.IO: Ready for seat synchronization
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
*Frontend opens at:* `http://localhost:5173`

---

## 👥 Demo User Credentials

The database comes pre-seeded with sample movies, theaters, screenings, and pre-configured accounts. Quick-fill buttons are provided on the login page for convenience:

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Administrator** | `admin@imovies.com` | `Admin@123` | Full access to Admin Dashboard, Analytics, Movie CRUD, Scheduling, and Customer Transactions |
| **Standard User** | `john@example.com` | `User@123` | Ticket booking, Seat selection, My Bookings, Profile management, and Cancellations |
| **Standard User 2**| `sarah@example.com`| `User@123` | Ticket booking and personal reservations |

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer account
- `POST /api/auth/login` — Login with email and password
- `GET /api/auth/me` — Retrieve current authenticated profile (Protected)
- `PUT /api/auth/profile` — Update account profile details (Protected)

### Movies (`/api/movies`)
- `GET /api/movies` — List movies (supports `search`, `genre`, `language`, `status`, `sort`, `page`, `limit`)
- `GET /api/movies/:id` — Get movie details with populated shows
- `POST /api/movies` — Create new movie (Admin only)
- `PUT /api/movies/:id` — Update movie (Admin only)
- `DELETE /api/movies/:id` — Delete movie and associated shows (Admin only)

### Theatres & Screens (`/api/theatres`)
- `GET /api/theatres` — List cinemas (optional `city` filter)
- `GET /api/theatres/:id` — Get cinema details with auditorium screens
- `POST /api/theatres` — Create new cinema (Admin only)
- `PUT /api/theatres/:id` — Update cinema (Admin only)
- `DELETE /api/theatres/:id` — Delete cinema and screens (Admin only)

### Shows & Live Seating (`/api/shows`)
- `GET /api/shows` — Query scheduled screenings (`movieId`, `theatreId`, `city`, `date`)
- `GET /api/shows/:id` — Retrieve full screen layout and real-time booked/held seats
- `POST /api/shows/:id/hold` — Hold seats temporarily (10-minute hold)
- `POST /api/shows/:id/release` — Release held seats early
- `POST /api/shows` — Schedule screening (Admin only)
- `PUT /api/shows/:id` — Update screening (Admin only)
- `DELETE /api/shows/:id` — Cancel screening (Admin only)

### Bookings (`/api/bookings`)
- `POST /api/bookings` — Atomically book seats with recalculation & QR code generation (Protected)
- `GET /api/bookings/my-bookings` — Retrieve current user's booking history (Protected)
- `GET /api/bookings/:id` — Get single booking details (Protected)
- `PUT /api/bookings/:id/cancel` — Cancel booking and restore seats (Protected)

### Admin Management (`/api/admin`)
- `GET /api/admin/stats` — Retrieve platform revenue, totals, and top-grossing titles (Admin only)
- `GET /api/admin/bookings` — Search and paginate all customer transactions (Admin only)
- `GET /api/admin/users` — List registered users (Admin only)

---

## 🧪 Testing

To run the automated backend unit & integration tests:

```bash
cd server
npm test
```

The test suite covers:
1. Health check service responsiveness
2. Customer registration and JWT generation
3. Prevention of duplicate email accounts
4. Rejection of invalid credentials
5. Catalog querying and filtering
6. Atomic seat allocation and conflict prevention under concurrent requests

---

## 💡 Notes & Production Deployment
- **Real Payment Gateways:** The payment flow currently uses a mock checkout handler (`paymentMethod: 'Credit/Debit Card (Mock)'`). For production, replace the handler in `server/controllers/bookingController.js` with Stripe, PayPal, or Razorpay webhooks.
- **Production Static Serving:** The backend Express app is configured to automatically serve the optimized React build from `client/dist` when available, enabling single-port deployment on platforms like Render, Railway, AWS, or Heroku.
