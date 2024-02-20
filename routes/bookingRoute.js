const express = require('express');
const bodyParser = require("body-parser");
const booking_Route = express.Router();
const bookingController = require('../controllers/bookingController');
const { user_auth } = require('../utils/authUtils');


booking_Route.use(bodyParser.urlencoded({ extended: true }));
booking_Route.use(bodyParser.json());


// View all available rooms
booking_Route.get('/rooms/available', user_auth, bookingController.viewAvailableRooms);

// Book a room
booking_Route.post('/rooms/book', user_auth, bookingController.bookRoom);

// Update a booking
booking_Route.put('/rooms/update-booking', user_auth, bookingController.updateBooking);

// Cancel a booking
booking_Route.delete('/rooms/cancel-booking', user_auth, bookingController.cancelBooking);

// // View all bookings
// booking_Route.get('/bookings', user_auth, bookingController.viewBookings);

module.exports =booking_Route;
