const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String },
            zipCode: { type: String },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
        },
        features: {
            bedrooms: { type: Number, required: true },
            bathrooms: { type: Number, required: true },
            area: { type: Number, required: true }, // in sqft
        },
        type: { type: String, enum: ['sale', 'rent'], required: true },
        propertyType: { type: String, enum: ['house', 'apartment', 'condo', 'villa', 'penthouse'], required: true },
        status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
        images: [{ type: String }],
        agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
