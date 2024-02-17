const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, bookingController.createBooking);
router.put('/:id', authenticateUser, bookingController.updateBooking);
router.delete('/:id', authenticateUser, bookingController.cancelBooking);
router.get('/availability', authenticateUser, bookingController.checkAvailability);

module.exports = router;
