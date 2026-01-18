const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
        agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ['pending', 'responded'], default: 'pending' },
    },
    { timestamps: true }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
