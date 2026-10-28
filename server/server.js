require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/db');
const { setupSocketIO } = require('./utils/socketHandler');
const { autoSeedIfEmpty } = require('./seed/seeder');

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize Socket.io events
setupSocketIO(io);

// Connect DB and Start Server
async function startServer() {
  try {
    await connectDB();

    // Auto seed database with movies, cinemas, shows, and admin user if empty
    await autoSeedIfEmpty();

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🎬 IMovies Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`⚡ Real-time Socket.IO: Ready for seat synchronization`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server alive in dev
});

startServer();
