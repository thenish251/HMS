// src/app.js or src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookingRoutes = require('./routes/bookingRoutes');

// Load environment variables from .env file
dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hotel-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use('/bookings', bookingRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});