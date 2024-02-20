const Room = require('../models/roomModel');
const Booking = require('../models/BookingModel');

// View all available rooms
const viewAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.find({ availability: true });
    res.status(200).json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book a room
const bookRoom = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;

    // Check if the room exists and is available
    const room = await Room.findById(roomId);
    if (!room || !room.availability) {
      return res.status(404).json({ message: 'Room not found or not available for booking' });
    }

    // Create a new booking
    const booking = new Booking({
      roomId,
      userId: req.user._id,
      startDate,
      endDate
    });

    await booking.save();
    res.status(201).json({ message: 'Room booked successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  try {
    const { bookingId, startDate, endDate } = req.body;

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking dates
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  viewAvailableRooms,
  bookRoom,
  updateBooking,
  cancelBooking
};
