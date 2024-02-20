const User = require("../../models/userModel");
const bcryptjs = require("bcryptjs");
const Joi = require("joi");
const { JWT_SECRET, EMAIL_PASSWORD, EMAIL_USER } = require("../../config");
const jwt = require("jsonwebtoken");



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

// //register otp mobile
// const registerOtpMobile = async (req, res) => {
//   try {

//     const schema = Joi.object({
//       mobile: Joi.string().length(10)
//         .pattern(/^\d{10}$/).required(),
//     })
//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       if (error.details.some((detail) => detail.context.key === "mobile")) {
//         return res.status(400).send({
//           success: false,
//           message: "Mobile number must be exactly 10 digits long",
//         });
//       }
//     }
//     let mobile = req.body.mobile;

//     if (mobile) {

//       // Generate a 6-digit OTP
//       const otp = otpGenerator.generate(6, {
//         upperCase: false,
//         specialChars: false,
//       });

//       const userOtp = new RegisterOtp({
//         otp: otp,
//         mobile: mobile
//       });
//       const result = await userOtp.save();
//       if (result) {
//         await sendOTP(mobile, otp);
//         res.status(200).send({
//           success: true,
//           message: "OTP has been sent to your mobile number",
//         });
//       } else {
//         res.status(400).send({ success: false, message: "Mobile number must be exactly 10 digits long" });
//       }


//     } else {
//       res.status(400).send({ success: false, message: "Mobile number must be exactly 10 digits long" })
//     }

//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }
// }

// // Verify OTP
// const verifyOtp = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       mobile: Joi.string().length(10)
//         .pattern(/^\d{10}$/).required(),
//     })
//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       if (error.details.some((detail) => detail.context.key === "mobile")) {
//         return res.status(400).send({
//           success: false,
//           message: "Mobile number must be exactly 10 digits long",
//         });
//       }
//     }
//     let mobile = req.body.mobile;
//     let otp = req.body.otp

//     if (!mobile || !otp) {
//       return res.status(400).json({ error: 'Mobile number and OTP are required' });
//     }

//     const userOtp = await RegisterOtp.findOne({ mobile: mobile })

//     if (userOtp) {
//       if (userOtp.otp === otp) {
//         // await RegisterOtp.findByIdAndUpdate(
//         //   userOtp._id, 
//         //   { $set: { otp: "" } }
//         // );
//         await RegisterOtp.findByIdAndRemove(userOtp._id);
//         res.status(200).send({
//           success: true,
//           message: "otp verified successfully",
//         });
//       } else {
//         res.status(400).json({ success: false, message: 'Otp incorrect' });
//       }

//     } else {
//       res.status(400).send({ success: false, message: error.message });
//     }

//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }

// }

//register user
const register_user = async (req, role, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      mobile: Joi.string().length(10).pattern(/^\d{10}$/).required(),
      // Add password validation if needed
      password: Joi.string().pattern(/^[a-zA-Z0-9@]{3,30}$/).required(),
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
    let spassword = ''; 

    if (req.body.password) {
      spassword = await securePassword(req.body.password);
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      // password: spassword,
      image: req.file.filename, // Assuming you handle image uploads
      role,
    });

    const userData = await User.findOne({ mobile: req.body.mobile });

    if (userData) {
      res.status(400).send({ success: false, message: "This mobile is already in use" });
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
      // image: req.file.filename,
      role,
    });
console.log("hiiiiiiiiiiiiiiiiii")
    const userData = await User.findOne({ email: req.body.email });

    if (userData) {
      res
        .status(400)
        .send({ success: false, message: "This email is already exists" });
    } else {
      const user_data = await user.save();
      const tokenData = await creat_token(
        user_data._id,
        user_data.role,
        user_data.email
      );
      res.status(200).send({ success: true, data: user_data, token: `Bearer ${tokenData}`, });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

//loginOtp
// const loginOtp = async (req, res) => {
//   try {
//     console.log(req.body.mobile)
//     const schema = Joi.object({
//       mobile: Joi.string().length(10)
//         .pattern(/^\d{10}$/).required(),
//     })
//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       if (error.details.some((detail) => detail.context.key === "mobile")) {
//         return res.status(400).send({
//           success: false,
//           message: "Mobile number must be exactly 10 digits long",
//         });
//       }
//     }
//     let mobile = req.body.mobile;

//     const userData = await User.findOne({ mobile: mobile });

//     console.log("fffffff", userData)

//     if (userData) {

//       // Generate a 6-digit OTP
//       const otp = otpGenerator.generate(6, {
//         upperCase: false,
//         specialChars: false,
//       });

//       const data = await User.updateOne(
//         { mobile: mobile },
//         { $set: { otp: otp } }
//       );

//       await sendOTP(mobile, otp);
//       res.status(200).send({
//         success: true,
//         message: "OTP has been sent to your mobile number",
//       });

//     } else {
//       res.status(400).send({ success: false, message: "Mobile number must be exactly 10 digits long" })
//     }

//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }
// }

// login Verify OTP
// const loginVerifyOTP = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       mobile: Joi.string().length(10)
//         .pattern(/^\d{10}$/).required(),
//     })
//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       if (error.details.some((detail) => detail.context.key === "mobile")) {
//         return res.status(400).send({
//           success: false,
//           message: "Mobile number must be exactly 10 digits long",
//         });
//       }
//     }
//     let mobile = req.body.mobile;
//     let otp = req.body.otp

//     if (!mobile || !otp) {
//       return res.status(400).json({ error: 'Mobile number and OTP are required' });
//     }

//     const userOtp = await User.findOne({ mobile: mobile })

//     if (userOtp) {
//       if (userOtp.otp === otp) {
//         await User.findByIdAndUpdate(
//           userOtp._id,
//           { $set: { otp: "" } }
//         );

//         const tokenData = await creat_token(
//           userOtp._id,
//           userOtp.role,
//           userOtp.email
//         );

//         res.status(200).send({
//           success: true,
//           message: "otp verified successfully",
//           token: `Bearer ${tokenData}`,
//         });
//       } else {
//         res.status(400).json({ success: false, message: 'Otp incorrect' });
//       }

//     } else {
//       res.status(400).send({ success: false, message: error.message });
//     }

//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }
// }
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
          image: userData.image,
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
  
  get_all_user,
  
};
