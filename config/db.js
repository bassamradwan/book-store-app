const mongoose = require('mongoose');

async function ConnectToDatabase() {
    // The connection string (with its user and password) lives in .env, never in the code.
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not set. Copy .env.example to .env and fill it in.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');
    } catch (error) {
        console.error('Could not connect to MongoDB...', error);
    }
}

module.exports = ConnectToDatabase;
