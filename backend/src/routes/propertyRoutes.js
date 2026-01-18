const express = require('express');
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('agent', 'admin'), upload.array('images', 5), createProperty);
router.put('/:id', protect, authorize('agent', 'admin'), upload.array('images', 5), updateProperty);
router.delete('/:id', protect, authorize('agent', 'admin'), deleteProperty);

module.exports = router;
