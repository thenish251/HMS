// src/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  roomType: { type: String, required: true },
  // Add other fields as needed
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
