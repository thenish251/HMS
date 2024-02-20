const multer = require('multer');

// Multer configuration for handling "form-data"
const upload = multer();

// Create the custom multer middleware
const customMulterMiddleware = (req, res, next) => {
  console.log(req.body);
  if (req.path.startsWith('/api')) {
    upload.none()(req, res, next);
  } else {
    next();
  }
};

module.exports = customMulterMiddleware;
