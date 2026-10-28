const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { moviesData, theatresData } = require('./seedData');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const SeatHold = require('../models/SeatHold');
const { connectDB } = require('../config/db');

dotenv.config();

// Screen seat layout configuration
function createDefaultSeatLayout() {
  // Rows A to H
  // Row A: VIP
  // Rows B, C, D: Premium
  // Rows E, F, G, H: Regular
  const rows = [
    { rowLabel: 'A', category: 'VIP', seatsCount: 12, aisles: [3, 9] },
    { rowLabel: 'B', category: 'Premium', seatsCount: 12, aisles: [3, 9] },
    { rowLabel: 'C', category: 'Premium', seatsCount: 12, aisles: [3, 9] },
    { rowLabel: 'D', category: 'Premium', seatsCount: 12, aisles: [3, 9] },
    { rowLabel: 'E', category: 'Regular', seatsCount: 12, aisles: [3, 9] },
    { rowLabel: 'F', category: 'Regular', seatsCount: 12, aisles: [3, 9] },
    { rowLabel: 'G', category: 'Regular', seatsCount: 12, aisles: [3, 9] },
    { rowLabel: 'H', category: 'Regular', seatsCount: 12, aisles: [3, 9] }
  ];
  return { rows };
}

const importData = async () => {
  try {
    console.log('[Seeder] Cleaning existing database collections...');
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Screen.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    await SeatHold.deleteMany();

    console.log('[Seeder] Creating Default Users (Admin and Standard Users)...');
    const adminUser = await User.create({
      name: 'IMovies Administrator',
      email: 'admin@imovies.com',
      password: 'Admin@123',
      role: 'admin',
      city: 'New York',
      phone: '+1 (555) 010-9999'
    });

    const demoUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'User@123',
      role: 'user',
      city: 'New York',
      phone: '+1 (555) 014-4321'
    });

    const demoUser2 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'User@123',
      role: 'user',
      city: 'Los Angeles',
      phone: '+1 (555) 018-7744'
    });

    console.log('[Seeder] Seeding Movies...');
    const createdMovies = await Movie.insertMany(moviesData);

    console.log('[Seeder] Seeding Theatres and Screens...');
    const createdTheatres = await Theatre.insertMany(theatresData);

    const createdScreens = [];
    for (const theatre of createdTheatres) {
      const screen1 = await Screen.create({
        theatre: theatre._id,
        screenName: `${theatre.name} - Screen 1 (IMAX Laser)`,
        format: 'IMAX 3D',
        soundSystem: 'Dolby Atmos 64-Channel',
        seatLayout: createDefaultSeatLayout(),
        totalSeats: 96
      });

      const screen2 = await Screen.create({
        theatre: theatre._id,
        screenName: `${theatre.name} - Screen 2 (Dolby Cinema)`,
        format: 'Dolby Cinema',
        soundSystem: 'Dolby Atmos Surround',
        seatLayout: createDefaultSeatLayout(),
        totalSeats: 96
      });

      createdScreens.push(screen1, screen2);
    }

    console.log('[Seeder] Scheduling Shows for next 7 days...');
    const nowShowingMovies = createdMovies.filter(m => m.status === 'now_showing');
    const timeSlots = ['10:30 AM', '01:45 PM', '05:15 PM', '08:30 PM', '10:45 PM'];

    // Generate dates for today + 7 days
    const dates = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const createdShows = [];
    let movieIndex = 0;

    for (const theatre of createdTheatres) {
      const theatreScreens = createdScreens.filter(s => s.theatre.toString() === theatre._id.toString());

      for (const date of dates) {
        for (const screen of theatreScreens) {
          // pick a movie for this screen
          const movie = nowShowingMovies[movieIndex % nowShowingMovies.length];
          movieIndex++;

          for (const time of timeSlots.slice(0, 3)) { // 3 shows per screen per day
            // Pre-seed some booked seats on the first few shows for realism
            let bookedSeats = [];
            if (date === dates[0]) {
              bookedSeats = ['B-4', 'B-5', 'C-6', 'C-7', 'A-6'];
            }

            const show = await Show.create({
              movie: movie._id,
              theatre: theatre._id,
              screen: screen._id,
              showDate: date,
              startTime: time,
              pricing: {
                regular: 12.0,
                premium: 16.5,
                vip: 22.0
              },
              bookedSeats,
              status: 'active'
            });
            createdShows.push(show);
          }
        }
      }
    }

    console.log('[Seeder] Creating Sample Confirmed Bookings...');
    if (createdShows.length > 0) {
      const sampleShow = createdShows[0];
      await Booking.create({
        user: demoUser._id,
        show: sampleShow._id,
        movie: sampleShow.movie,
        theatre: sampleShow.theatre,
        screen: sampleShow.screen,
        bookingReference: 'IMV-20261027-DEMO1',
        seats: ['B-4', 'B-5'],
        seatDetails: [
          { seat: 'B-4', category: 'Premium', price: 16.5 },
          { seat: 'B-5', category: 'Premium', price: 16.5 }
        ],
        snacks: [
          { id: 'snack-1', name: 'Caramel Popcorn (L)', quantity: 1, price: 8.5 },
          { id: 'snack-2', name: 'Pepsi Zero (M)', quantity: 2, price: 4.5 }
        ],
        subtotal: 33.0,
        convenienceFee: 3.0,
        taxes: 3.68,
        totalAmount: 57.18,
        paymentMethod: 'Credit/Debit Card (Mock)',
        paymentStatus: 'PAID',
        bookingStatus: 'CONFIRMED',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      });
    }

    console.log('✅ [Seeder] Seed data successfully generated:');
    console.log(`   - Users: 3 (Admin: admin@imovies.com / Admin@123 | User: john@example.com / User@123)`);
    console.log(`   - Movies: ${createdMovies.length}`);
    console.log(`   - Theatres: ${createdTheatres.length}`);
    console.log(`   - Screens: ${createdScreens.length}`);
    console.log(`   - Shows: ${createdShows.length}`);
    return true;
  } catch (err) {
    console.error(`❌ [Seeder Error] Failed to seed database:`, err);
    throw err;
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Screen.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    await SeatHold.deleteMany();
    console.log('⚠️ [Seeder] All database records deleted!');
  } catch (err) {
    console.error(`❌ [Seeder Error]`, err);
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('[Seeder] Database is empty. Running initial auto-seeder...');
      await importData();
    } else {
      console.log(`[Database] Verified ${movieCount} movies loaded in database.`);
    }
  } catch (err) {
    console.warn(`[Seeder] Auto-seed check warning: ${err.message}`);
  }
};

// Check if running directly
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  connectDB().then(async () => {
    if (process.argv[2] === '-d') {
      await destroyData();
      process.exit();
    } else {
      await importData();
      process.exit();
    }
  });
}

module.exports = { importData, destroyData, autoSeedIfEmpty };
