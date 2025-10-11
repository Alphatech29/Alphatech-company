const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists in project root
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with versioning
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = 'platform';
    let fileName = `${baseName}${ext}`;
    let counter = 1;

    // If file exists, append a counter
    while (fs.existsSync(path.join(uploadDir, fileName))) {
      fileName = `${baseName}-${counter}${ext}`;
      counter++;
    }

    cb(null, fileName);
  },
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only .png, .jpg and .jpeg files are allowed.'));
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

// Error handling middleware
const uploadErrorHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max size is 2MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

module.exports = { upload, uploadErrorHandler };
