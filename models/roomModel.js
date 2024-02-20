const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: [ "admin"],
    default: "admin",
  }
});

module.exports = mongoose.model('Room', roomSchema);
