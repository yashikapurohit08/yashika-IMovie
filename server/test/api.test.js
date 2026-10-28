const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const mongoose = require('mongoose');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

let testServer;
let baseUrl;

before(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();

  testServer = http.createServer(app);
  await new Promise((resolve) => {
    testServer.listen(0, () => {
      const port = testServer.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (testServer) {
    await new Promise((resolve) => testServer.close(resolve));
  }
  await disconnectDB();
});

describe('IMovies API Test Suite', () => {
  let authToken = '';
  let testUserId = '';
  let testShowId = '';

  let registeredEmail = '';

  test('1. Health check returns status online', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'online');
  });

  test('2. User Registration works and returns token', async () => {
    registeredEmail = `test_${Date.now()}@testimovies.com`;
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Unit Tester',
        email: registeredEmail,
        password: 'Password@123',
        city: 'New York'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, registeredEmail);

    authToken = data.token;
    testUserId = data.user.id;
  });

  test('3. Duplicate user registration is prevented', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Guy',
        email: registeredEmail, // Try to register with same email
        password: 'Password@123'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
    assert.match(data.message, /already exists/i);
  });

  test('4. Login with invalid password fails', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'WrongPassword999'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.success, false);
  });

  test('5. Get movies list returns active movies', async () => {
    const res = await fetch(`${baseUrl}/api/movies`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.movies));
  });

  test('6. Atomic seat booking and conflict prevention', async () => {
    // Create test movie, theatre, screen, show
    const movie = await Movie.create({
      title: 'Atomic Test Movie',
      description: 'Test movie description',
      genres: ['Action'],
      language: 'English',
      duration: 120,
      poster: 'https://example.com/poster.jpg',
      backdrop: 'https://example.com/backdrop.jpg',
      releaseDate: new Date()
    });

    const theatre = await Theatre.create({
      name: 'Test Cinema',
      city: 'New York',
      location: 'Test Location',
      address: '123 Test St'
    });

    const screen = await Screen.create({
      theatre: theatre._id,
      screenName: 'Screen 1',
      totalSeats: 96,
      seatLayout: {
        rows: [{ rowLabel: 'A', category: 'Regular', seatsCount: 10, aisles: [] }]
      }
    });

    const show = await Show.create({
      movie: movie._id,
      theatre: theatre._id,
      screen: screen._id,
      showDate: '2026-10-30',
      startTime: '07:00 PM',
      pricing: { regular: 15, premium: 20, vip: 25 },
      bookedSeats: []
    });

    testShowId = show._id.toString();

    // First booking attempt for seat A-1: should succeed
    const res1 = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        showId: testShowId,
        seats: ['A-1'],
        paymentMethod: 'Mock Card'
      })
    });
    const data1 = await res1.json();
    assert.strictEqual(res1.status, 201);
    assert.strictEqual(data1.success, true);
    assert.ok(data1.booking.bookingReference);

    // Second booking attempt for the SAME seat A-1: must be rejected with conflict (409)
    const res2 = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        showId: testShowId,
        seats: ['A-1'],
        paymentMethod: 'Mock Card'
      })
    });
    const data2 = await res2.json();
    assert.strictEqual(res2.status, 409);
    assert.strictEqual(data2.success, false);
    assert.match(data2.message, /conflict|already booked/i);
  });
});
