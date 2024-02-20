const Room = require('../models/roomModel');


// create a new room
const createRoom = async (req, res) => {
  try {
    // Check if the user is authenticated and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { roomId, type } = req.body;

    console.log('Received data:', roomId, type);

    // Check if room with the same roomId already exists
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room with this ID already exists' });
    }

    const room = new Room({
      roomId,
      type
    });

    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Read all rooms
const getAllRooms = async (req, res) => {
  try {
    // Check if the user is authenticated and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read room by ID
const getRoomById = async (req, res) => {
  try {
    // Check if the user is authenticated and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room by ID
const updateRoomById = async (req, res) => {
  try {
    // Check if the user is authenticated and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { id } = req.params;
    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete room by ID
const deleteRoomById = async (req, res) => {
  try {
    // Check if the user is authenticated and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { id } = req.params;
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create availability for a room
const createAvailability = async (req, res) => {
    try {
      // Check if the user is authenticated and has admin role
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const { roomId, availability, startDate, endDate } = req.body;
  
      // Check if the room exists
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      // Set room availability
      room.availability = availability;
  
      // If availability is set to false, update start and end dates accordingly
      if (!availability) {
        room.startDate = startDate;
        room.endDate = endDate;
      }
  
      await room.save();
  
      res.status(201).json({ message: 'Room availability created successfully', room });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Check availability for a specific date range and room type
const checkAvailability = async (req, res) => {
    try {
      // Check if the user is authenticated and has admin role
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const { startDate, endDate, roomType } = req.body;
  
      // Check if any room of the given type is available for the specified date range
      const availableRooms = await Room.find({
        type: roomType,
        availability: true,
        $or: [
          { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
          { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
          { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
        ]
      });
  
      if (availableRooms.length === 0) {
        return res.status(200).json({ message: 'No rooms available for the specified date range' });
      }
  
      res.status(200).json({ message: 'Rooms available for booking', availableRooms });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Update availability for a room
const updateAvailability = async (req, res) => {
    try {
      // Check if the user is authenticated and has admin role
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const { roomId, availability, startDate, endDate } = req.body;
  
      // Check if the room exists
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      // Update room availability
      room.availability = availability;
  
      // If availability is set to false, update start and end dates accordingly
      if (!availability) {
        room.startDate = startDate;
        room.endDate = endDate;
      }
  
      await room.save();
  
      res.status(200).json({ message: 'Room availability updated successfully', room });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  createAvailability,
  checkAvailability,
  updateAvailability
};
