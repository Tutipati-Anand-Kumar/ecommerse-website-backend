const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL_ENV;
const uploadDir = isVercel ? '/tmp/uploads' : path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const tempName = 'temp_' + Date.now() + ext;
    cb(null, tempName);
  }
});

const fileFilter = (req, file, cb) => {
  const types = /jpeg|jpg|png/;
  const ext = types.test(path.extname(file.originalname).toLowerCase());
  const mime = types.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files allowed!'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
