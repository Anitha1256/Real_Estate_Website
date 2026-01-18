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

const promoteUser = async () => {
    await connectDB();

    const email = process.argv[2];

    if (!email) {
        console.log('Please provide an email address as an argument.');
        process.exit(1);
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
        } else {
            console.log(`User with email ${email} not found.`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
};

promoteUser();
