const express = require('express');
const { createAppointment, getMyAppointments, getAgentAppointments, updateAppointment, getAllAppointments } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/agent', protect, getAgentAppointments);
router.put('/:id', protect, updateAppointment);
router.get('/admin', protect, authorize('admin'), getAllAppointments);

module.exports = router;
