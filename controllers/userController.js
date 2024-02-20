const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const Joi = require("joi");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const passport = require("../middleware/passport");

// password Hash
const securePassword = async (password) => {
  try {
    const passwordHash = bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//creat token
const creat_token = async (id, role, email) => {
  try {
    const token = await jwt.sign({ _id: id, role: role, email }, JWT_SECRET);

    return token;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//register user
const register_user = async (req, role, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      mobile: Joi.string()
        .length(10)
        .pattern(/^\d{10}$/)
        .required(),
      // Add password validation if needed
      password: Joi.string()
        .pattern(/^[a-zA-Z0-9@]{3,30}$/)
        .required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      // Handle specific validation errors
      if (error.details.some((detail) => detail.context.key === "mobile")) {
        return res.status(400).send({
          success: false,
          message: "Mobile number must be exactly 10 digits long",
        });
      }

      if (error.details.some((detail) => detail.context.key === "email")) {
        return res.status(400).send({
          success: false,
          message: "Email must be a valid email",
        });
      }

      // Add more specific error handling if needed for the password field
      if (error.details.some((detail) => detail.context.key === "password")) {
        return res.status(400).send({
          success: false,
          message: "Please enter a valid password",
        });
      }

      return res.status(400).send({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    // Add password validation logic here if needed

    // Assuming securePassword and User models are correctly defined
    let spassword = "";

    if (req.body.password) {
      spassword = await securePassword(req.body.password);
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      role,
    });

    const userData = await User.findOne({ mobile: req.body.mobile });

    if (userData) {
      res
        .status(400)
        .send({ success: false, message: "This mobile is already in use" });
    } else {
      const user_data = await user.save();
      const tokenData = await creat_token(
        user_data._id,
        user_data.role,
        user_data.email
      );

      res.status(200).send({
        success: true,
        data: user_data,
        token: `Bearer ${tokenData}`,
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

//register admin
const register_admin = async (req, role, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      mobile: Joi.string()
        .length(10)
        .pattern(/^\d{10}$/)
        .required(),
      password: Joi.string()
        .pattern(/^[a-zA-Z0-9@]{3,30}$/)
        .required(),
      role: Joi.string(),
    });
console.log("hiiiiiiiiii")
    const { error, value } = schema.validate(req.body);

    if (error) {
      if (error.details.some((detail) => detail.context.key === "mobile")) {
        return res.status(400).send({
          success: false,
          message: "Mobile number must be exactly 10 digits long",
        });
      }

      if (error.details.some((detail) => detail.context.key === "email")) {
        return res.status(400).send({
          success: false,
          message: "email must be a valid email",
        });
      }

      if (error.details.some((detail) => detail.context.key === "password")) {
        return res.status(400).send({
          success: false,
          message: "please enter valid password",
        });
      }

      return res.status(400).send({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const spassword = await securePassword(req.body.password);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      role,
    });
    console.log(
      "hiiiiiiiiiiiiiiiiii",
      req.body.name,
      req.body.email,
      req.body.mobile,
      req.body.password
    );
    const userData = await User.findOne({ email: req.body.email });

    if (userData) {
      res.status(400).json({ success: false, message: "This email is already exists" });
    } else {
      const user_data = await user.save();
      const tokenData = await creat_token(
        user_data._id,
        user_data.role,
        user_data.email
      );
      res.status(200).json({ success: true, data: user_data, token: `Bearer ${tokenData}` });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

//login
const login_user = async (req, role, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(/^[a-zA-Z0-9@]{3,30}$/)
        .required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      if (error.details.some((detail) => detail.context.key === "email")) {
        return res.status(400).send({
          success: false,
          message: "email must be a valid email",
        });
      }

      if (error.details.some((detail) => detail.context.key === "password")) {
        return res.status(400).send({
          success: false,
          message: "please enter a valid password",
        });
      }

      return res.status(400).send({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      if (userData.blocked === true) {
        return res.status(403).json({
          success: false,
          message: `you are not allowed to access this page`,
        });
      }

      if (userData.role !== role) {
        return res.status(403).json({
          success: false,
          message: `you are not allowed to access this page`,
        });
      }

      const passwordMatch = await bcryptjs.compare(password, userData.password);

      if (passwordMatch) {
        const tokenData = await creat_token(
          userData._id,
          userData.role,
          userData.email
        );
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          role: userData.role,
          token: `Bearer ${tokenData}`,
        };
        const response = {
          success: true,
          message: "user details",
          data: userResult,
        };

        res.status(200).send(response);
      } else {
        res
          .status(200)
          .send({ success: false, message: "Login details are incorrect" });
      }
    } else {
      res
        .status(200)
        .send({ success: false, message: "Login details are incorrect" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const admin_login = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(/^[a-zA-Z0-9@]{3,30}$/)
        .required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      if (error.details.some((detail) => detail.context.key === "email")) {
        return res.status(400).send({
          success: false,
          message: "Email must be a valid email",
        });
      }

      if (error.details.some((detail) => detail.context.key === "password")) {
        return res.status(400).send({
          success: false,
          message: "Please enter a valid password",
        });
      }

      return res.status(400).send({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const email = req.body.email;
    const password = req.body.password;

    const adminData = await Admin.findOne({ email: email });

    if (adminData) {
      const passwordMatch = await bcryptjs.compare(
        password,
        adminData.password
      );

      if (passwordMatch) {
        const tokenData = await create_token(
          adminData._id,
          "admin", // assuming admin role is 'admin'
          adminData.email
        );
        const adminResult = {
          _id: adminData._id,
          email: adminData.email,
          // Add other admin data as needed
          token: `Bearer ${tokenData}`,
        };
        const response = {
          success: true,
          message: "Admin details",
          data: adminResult,
        };

        res.status(200).send(response);
      } else {
        res
          .status(200)
          .send({ success: false, message: "Login details are incorrect" });
      }
    } else {
      res
        .status(200)
        .send({ success: false, message: "Login details are incorrect" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

//  get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -otp");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

//get_all_user
const get_all_user = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "-password -role -otp"
    );
    res.status(200).send({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports = {
  register_user,
  register_admin,
  login_user,
  admin_login,
  getUserById,
  get_all_user,
};
