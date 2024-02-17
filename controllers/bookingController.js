const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    // Logic to create a new booking
    const { startDate, endDate, roomType } = req.body;
    const booking = new Booking({ startDate, endDate, roomType });
    await booking.save();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an existing booking
exports.updateBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate, roomType } = req.body;
      
      // Find the booking by ID
      const booking = await Booking.findById(id);
  
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      // Update the booking fields
      booking.startDate = startDate;
      booking.endDate = endDate;
      booking.roomType = roomType;
  
      // Save the updated booking
      await booking.save();
  
      res.status(200).json({ message: 'Booking updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

// Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the booking by ID
      const booking = await Booking.findById(id);
  
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      // Delete the booking
      await booking.delete();
  
      res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Check availability for a specific date range and room type
exports.checkAvailability = async (req, res) => {
  try {
    // Logic to check availability
    res.status(200).json({ availability: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
