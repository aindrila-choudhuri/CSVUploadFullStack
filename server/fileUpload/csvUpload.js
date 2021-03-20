const multer  = require('multer');

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
        cb(null, true);
    } else {
      cb("Please upload only csv file.", false);
    }
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const csvUpload = multer({ storage, fileFilter });

  module.exports = csvUpload;