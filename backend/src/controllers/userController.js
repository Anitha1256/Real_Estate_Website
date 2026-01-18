const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Property = require('../models/Property');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/users
const registerUser = async (req, res) => {
    const { name, email, password, role, phone } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role, phone });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get all agents
// @route   GET /api/users/agents
const getAgents = async (req, res) => {
    const agents = await User.find({ role: 'agent' }).select('-password').lean();

    const agentsWithCounts = await Promise.all(agents.map(async (agent) => {
        const count = await Property.countDocuments({ agent: agent._id });
        return { ...agent, listingsCount: count };
    }));

    res.json(agentsWithCounts);
};

// @desc    Get agent profile
// @route   GET /api/users/agents/:id
const getAgentById = async (req, res) => {
    const agent = await User.findById(req.params.id).select('-password');
    if (agent && agent.role === 'agent') {
        res.json(agent);
    } else {
        res.status(404).json({ message: 'Agent not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.profileImage) user.profileImage = req.body.profileImage;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.about) user.about = req.body.about;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user password
// @route   PUT /api/users/password
const updateUserPassword = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(req.body.currentPassword))) {
        user.password = req.body.newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401).json({ message: 'Invalid current password' });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password').lean();
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, authUser, getAgents, getAgentById, updateUserProfile, updateUserPassword, getAllUsers, deleteUser };
