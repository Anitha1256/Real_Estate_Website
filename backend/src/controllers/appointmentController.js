const Appointment = require('../models/Appointment');
const Property = require('../models/Property');

// @desc    Schedule a viewing
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
    try {
        const { propertyId, appointmentDate, notes } = req.body;

        const property = await Property.findById(propertyId).populate('agent');
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const appointment = await Appointment.create({
            user: req.user._id,
            property: propertyId,
            agent: property.agent._id,
            appointmentDate,
            notes,
        });

        // Send email to agent
        if (property.agent && property.agent.email) {
            try {
                const sendEmail = require('../utils/sendEmail');
                const subject = `New Viewing Request for ${property.title}`;
                const html = `
                    <h3>New Viewing Scheduled</h3>
                    <p>A user has scheduled a viewing for your property: <strong>${property.title}</strong></p>
                    <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleString()}</p>
                    <p><strong>Notes:</strong> ${notes || 'None'}</p>
                    <p><strong>From:</strong> ${req.user.name} (${req.user.email})</p>
                    <p>Please log in to your dashboard to confirm or reschedule.</p>
                `;

                await sendEmail({
                    email: property.agent.email,
                    subject,
                    message: `New viewing request for ${property.title} on ${new Date(appointmentDate).toLocaleString()}`,
                    html
                });
            } catch (emailError) {
                console.error('Email send failed:', emailError);
            }
        }

        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user._id })
            .populate('property', 'title images location')
            .populate('agent', 'name email');
        res.json(appointments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get agent appointments (appointments request for agent)
// @route   GET /api/appointments/agent
// @access  Private (Agent)
const getAgentAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ agent: req.user._id })
            .populate('property', 'title images')
            .populate('user', 'name email phone')
            .sort('-appointmentDate');
        res.json(appointments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Agent/Admin)
const updateAppointment = async (req, res) => {
    try {
        const { status, appointmentDate } = req.body;
        const appointment = await Appointment.findById(req.params.id)
            .populate('user', 'name email')
            .populate('property', 'title');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Verify ownership (Agent)
        if (appointment.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = status || appointment.status;
        appointment.appointmentDate = appointmentDate || appointment.appointmentDate;
        await appointment.save();

        // Send email to User
        if (appointment.user && appointment.user.email) {
            try {
                const sendEmail = require('../utils/sendEmail');
                const subject = `Viewing Update: ${appointment.property.title}`;
                const html = `
                    <h3>Viewing Update</h3>
                    <p>Your property viewing status has been updated.</p>
                    <p><strong>Property:</strong> ${appointment.property.title}</p>
                    <p><strong>New Status:</strong> ${status ? status.toUpperCase() : appointment.status.toUpperCase()}</p>
                    <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</p>
                    <p>Please log in to your dashboard for more details.</p>
                `;

                await sendEmail({
                    email: appointment.user.email,
                    subject,
                    message: `Your viewing for ${appointment.property.title} has been updated to ${appointment.status}.`,
                    html
                });
            } catch (emailError) {
                console.error('Email send failed:', emailError);
            }
        }

        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments/admin
// @access  Private (Admin)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('property', 'title')
            .populate('user', 'name email')
            .populate('agent', 'name email')
            .sort('-appointmentDate');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createAppointment, getMyAppointments, getAgentAppointments, updateAppointment, getAllAppointments };
