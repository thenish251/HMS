const express = require("express");
const cors = require("cors");
const { APP_PORT, DB_URL } = require("./config");
const mongoose = require("mongoose");
const passport = require("passport");



//user_routes
const user_routes = require("./routes/userRoute");
const room_Route = require("./routes/roomRoute");
const booking_Route = require("./routes/bookingRoute");
//store_routes
// const customMulterMiddleware = require("./middleware/customMiddleware");

const app = express();
app.use(cors());
app.use('/public', express.static('public'));
// app.use(customMulterMiddleware);  // <-- This line causes the error
app.use(passport.initialize());

require("./middleware/passport")(passport);

//user_routes
app.use("/api", user_routes);
app.use('/api', room_Route); 
app.use('/api', booking_Route)



app.listen(APP_PORT, function () {
  console.log(`Server started on port number ${APP_PORT}`);
});



mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((data) => {
  console.log(`Mongodb connected with server: ${APP_PORT}`);
})
.catch((error) => {
  console.error(`Error connecting to MongoDB: ${error}`);
});

