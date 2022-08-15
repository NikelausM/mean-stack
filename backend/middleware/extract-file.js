const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error("invalid mime type");
    callback(error, 'images');
  },
  filename: (req, file, callback) => {
    console.log("typeof(file): ", typeof (file));
    console.log("file: ", file);
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, `${name}-${Date.now()}.${ext}`)
  }
});

module.exports = multer({ storage: storage }).single('image');