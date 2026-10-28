const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      try {
        console.log(`[Database] Attempting connection to MongoDB at configured URI...`);
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 4000
        });
        console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn(`[Database] Could not connect to configured MONGODB_URI: ${err.message}`);
        console.log(`[Database] Falling back to seamless embedded MongoDB engine for development...`);
      }
    }

    // Try default local MongoDB first
    try {
      console.log(`[Database] Checking for local MongoDB service at mongodb://127.0.0.1:27017/imovies...`);
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/imovies', {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`[Database] Connected to local MongoDB daemon: ${conn.connection.host}`);
      return conn;
    } catch (localErr) {
      console.log(`[Database] No local mongod instance running (${localErr.message}). Initializing embedded MongoDB server...`);
    }

    // Fallback: embedded MongoMemoryServer
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[Database] Embedded MongoDB Server started and connected at: ${uri}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to initialize database: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error(`[Database] Disconnect error: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
