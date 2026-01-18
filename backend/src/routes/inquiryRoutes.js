const express = require('express');
const { createInquiry, getMyInquiries, getAgentInquiries, replyToInquiry, getAllInquiries } = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createInquiry);
router.get('/my', protect, getMyInquiries);
router.get('/agent', protect, getAgentInquiries);
router.post('/:id/reply', protect, replyToInquiry);
router.get('/admin', protect, authorize('admin'), getAllInquiries);

module.exports = router;
