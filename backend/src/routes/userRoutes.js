const express = require('express');
const { registerUser, authUser, getAgents, getAgentById, updateUserProfile, updateUserPassword, getAllUsers, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/agents', getAgents);
router.get('/agents/:id', getAgentById);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);
router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
