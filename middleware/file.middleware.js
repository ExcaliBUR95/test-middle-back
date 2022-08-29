const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'upload/');
  },
  filename(req, file, cb) {
    let ext = req.user._id + path.extname(file.originalname);
    cb(null, ext);
  },
});

const types = ['image/jpg', 'image/jpeg', 'image/png'];

const fileFilter = (req, file, cb) => {
  const fileSize = parseInt(req.headers['content-length']);
  if (types.includes(file.mimetype) && fileSize <= 1282810) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage, fileFilter });
