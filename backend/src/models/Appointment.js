const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
        agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        appointmentDate: { type: Date, required: true },
        status: { type: String, enum: ['pending', 'confirmed', 'canceled', 'completed'], default: 'pending' },
        notes: { type: String },
    },
    { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
