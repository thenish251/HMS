const express = require("express");
const bodyParser = require("body-parser");
const room_Route = express();
const {
  createRoom,
  updateRoomById,
  deleteRoomById,
  getRoomById,
  getAllRooms,
  createAvailability,
  updateAvailability
} = require("../controllers/roomController");
const { user_auth, checkRole } = require("../utils/authUtils");

room_Route.use(bodyParser.urlencoded({ extended: true }));
room_Route.use(bodyParser.json());

// Create a new room
room_Route.post("/rooms", user_auth, checkRole(["admin"]), (req, res) => createRoom(req, res));

// Update an existing room
room_Route.put("/rooms/:id", user_auth, checkRole(["admin"]), (req, res) => updateRoomById(req, res));

// Delete a room
room_Route.delete("/rooms/:id", user_auth, checkRole(["admin"]), (req, res) => deleteRoomById(req, res));

// Get a room by ID
room_Route.get("/rooms/:id", user_auth, (req, res) => getRoomById(req, res));

// Get all rooms
room_Route.get("/rooms", user_auth, (req, res) => getAllRooms(req, res));

// Create availability for a room
room_Route.post("/availability", user_auth, checkRole(["admin"]), (req, res) => createAvailability(req, res));

// Update availability for a room
room_Route.put("/availability/:id", user_auth, checkRole(["admin"]), (req, res) => updateAvailability(req, res));

module.exports = room_Route;
