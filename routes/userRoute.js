const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const user_route = express();
const {
  register_user,
  register_admin,
  login_user,
  get_all_user,
} = require("../controllers/auth/userController");
const auth = require("../middleware/auth");

const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(bodyParser.json());
user_route.use(express.static("public"));

const path = require("path");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/userImages"),
      function (error, sucess) {
        if (error) throw error;
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, function (error1, sucess1) {
      if (error1) throw error1;
    });
  },
});

const upload = multer({ storage: storage });

// register user
user_route.post("/register", upload.single("image"), (req, res) =>
  register_user(req, "user", res)
);

//register admin
user_route.post("/register-admin", upload.single("image"), (req, res) =>
  register_admin(req, "admin", res)
);

//login user
user_route.post("/login", (req, res) => login_user(req, "user", res));

//login admin
user_route.post("/login-admin", (req, res) => login_user(req, "admin", res));

//get all user
user_route.get(
  "/all-users",
  user_auth,
  checkRole(["admin"]),
  async (req, res) => get_all_user(req, res)
);

module.exports = user_route;
