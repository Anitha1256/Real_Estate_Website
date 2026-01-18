const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
const getProperties = async (req, res) => {
    const { city, minPrice, maxPrice, propertyType, bedrooms, agentId } = req.query;
    let query = {};

    if (city) {
        const cityRegex = new RegExp(city.trim(), 'i');
        query.$or = [
            { 'location.city': cityRegex },
            { 'location.address': cityRegex },
            { 'location.state': cityRegex }
        ];
    }
    if (propertyType) query.propertyType = propertyType;
    if (bedrooms) query['features.bedrooms'] = { $gte: Number(bedrooms) };
    if (agentId) query.agent = agentId;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query).populate('agent', 'name email profileImage');
    res.json(properties);
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
const getPropertyById = async (req, res) => {
    const property = await Property.findById(req.params.id).populate('agent', 'name email profileImage phone about');
    if (property) {
        res.json(property);
    } else {
        res.status(404).json({ message: 'Property not found' });
    }
};

// @desc    Create a property
// @route   POST /api/properties
const createProperty = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'No data received' });
        }
        let { title, description, price, location, features, type, propertyType } = req.body;

        // Parse JSON strings if they come from FormData
        if (typeof location === 'string') location = JSON.parse(location);
        if (typeof features === 'string') features = JSON.parse(features);

        // Get Cloudinary URLs from req.files
        const images = req.files ? req.files.map(file => file.path) : [];

        const property = new Property({
            title,
            description,
            price,
            location,
            features,
            type,
            propertyType,
            images,
            agent: req.user._id,
        });

        const createdProperty = await property.save();
        res.status(201).json(createdProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(400).json({ message: error.message || 'Failed to create property' });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this property' });
        }

        let updateData = { ...req.body };

        // Parse JSON strings if they come from FormData
        if (typeof updateData.location === 'string') updateData.location = JSON.parse(updateData.location);
        if (typeof updateData.features === 'string') updateData.features = JSON.parse(updateData.features);

        // Handle images if new ones are uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            // If user wants to replace images, they'll send them here
            // For now, let's assume we append or replace based on a flag or just replace
            updateData.images = newImages;
        }

        Object.assign(property, updateData);
        const updatedProperty = await property.save();
        res.json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(400).json({ message: error.message || 'Failed to update property' });
    }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (property) {
        if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await property.deleteOne();
        res.json({ message: 'Property removed' });
    } else {
        res.status(404).json({ message: 'Property not found' });
    }
};

module.exports = { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
