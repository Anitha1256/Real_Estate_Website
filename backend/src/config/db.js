const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (process.env.MONGO_URI.includes('example.mongodb.net')) {
            console.error('\x1b[31m%s\x1b[0m', '❌ Error: You are using the placeholder MONGO_URI.');
            console.error('\x1b[33m%s\x1b[0m', 'Please update the MONGO_URI in your backend/.env file with your real connection string from MongoDB Atlas.');
        } else {
            console.error(`❌ Error: ${error.message}`);
        }
        process.exit(1);
    }
};

module.exports = connectDB;
