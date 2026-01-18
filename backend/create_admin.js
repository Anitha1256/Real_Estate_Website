const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const createAdmin = async () => {
    await connectDB();

    const adminEmail = 'admin@estatepro.com';
    const adminPassword = 'admin123';

    try {
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists');
            // Ensure role is admin
            if (userExists.role !== 'admin') {
                userExists.role = 'admin';
                await userExists.save();
                console.log('Updated existing user role to Admin');
            }
        } else {
            const user = await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                phone: '+1 (555) 000-ADMIN'
            });
            console.log(`Admin user created successfully: ${user.email}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
};

createAdmin();
