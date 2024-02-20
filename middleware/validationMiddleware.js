const Joi = require("joi");

// Validate data for creating a new booking
const validateCreateBooking = (req, res, next) => {
  const schema = Joi.object({
    roomType: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details.map(d => d.message) });
  }

  next();
};

// Validate data for updating an existing booking
const validateUpdateBooking = (req, res, next) => {
  const schema = Joi.object({
    roomType: Joi.string(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).min(1); // At least one field is required for update

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details.map(d => d.message) });
  }

  next();
};

module.exports = {
  validateCreateBooking,
  validateUpdateBooking
};
