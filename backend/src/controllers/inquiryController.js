const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private
const createInquiry = async (req, res) => {
    try {
        const { propertyId, message } = req.body;

        const property = await Property.findById(propertyId).populate('agent');
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const inquiry = await Inquiry.create({
            user: req.user._id,
            property: propertyId,
            agent: property.agent._id,
            message,
        });

        // Send email to agent
        if (property.agent && property.agent.email) {
            try {
                const sendEmail = require('../utils/sendEmail');
                const subject = `New Inquiry for ${property.title}`;
                const html = `
                    <h3>New Inquiry Received</h3>
                    <p>You have received a new inquiry for your property: <strong>${property.title}</strong></p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                    <p><strong>From:</strong> ${req.user.name} (${req.user.email})</p>
                    <p>Please log in to your dashboard to view more details.</p>
                `;

                await sendEmail({
                    email: property.agent.email,
                    subject,
                    message: `New inquiry for ${property.title}: ${message}`,
                    html
                });
            } catch (emailError) {
                console.error('Email send failed:', emailError);
                // Continue without failing the request
            }
        }

        res.status(201).json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user inquiries
// @route   GET /api/inquiries
// @access  Private
const getMyInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ user: req.user._id })
            .populate('property', 'title images location')
            .populate('agent', 'name email');
        res.json(inquiries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get agent inquiries (inquiries received by agent)
// @route   GET /api/inquiries/agent
// @access  Private (Agent)
const getAgentInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ agent: req.user._id })
            .populate('property', 'title images')
            .populate('user', 'name email phone')
            .sort('-createdAt');
        res.json(inquiries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Reply to an inquiry
// @route   POST /api/inquiries/:id/reply
// @access  Private (Agent)
const replyToInquiry = async (req, res) => {
    try {
        const { message } = req.body;
        const inquiry = await Inquiry.findById(req.params.id)
            .populate('user', 'name email')
            .populate('property', 'title');

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        // Verify ownership
        if (inquiry.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Send email to User
        if (inquiry.user && inquiry.user.email) {
            try {
                const sendEmail = require('../utils/sendEmail');
                const subject = `Reply regarding: ${inquiry.property.title}`;
                const html = `
                    <h3>New Message from Agent</h3>
                    <p>You have received a reply regarding your inquiry for: <strong>${inquiry.property.title}</strong></p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                        <p style="margin: 0;">${message.replace(/\n/g, '<br>')}</p>
                    </div>
                    <p><strong>From:</strong> ${req.user.name} (${req.user.email})</p>
                `;

                await sendEmail({
                    email: inquiry.user.email,
                    subject,
                    message: `Reply from agent regarding ${inquiry.property.title}: ${message}`,
                    html
                });

                res.json({ message: 'Reply sent successfully' });
            } catch (emailError) {
                console.error('Email send failed:', emailError);
                res.status(500).json({ message: 'Failed to send email' });
            }
        } else {
            res.status(400).json({ message: 'User email not found' });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries/admin
// @access  Private (Admin)
const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({})
            .populate('property', 'title')
            .populate('user', 'name email')
            .populate('agent', 'name email')
            .sort('-createdAt');
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createInquiry, getMyInquiries, getAgentInquiries, replyToInquiry, getAllInquiries };
