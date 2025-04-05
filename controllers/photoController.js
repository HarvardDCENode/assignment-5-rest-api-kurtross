const multer = require('multer');
const path = require('path');

// storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/static/img'); // Directory to save the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Naming convention for the files
    }
});

// file filter to accept only image files
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('only image files allowed'), false);
    }
    cb(null, true);
};

module.exports = {
    storage: storage,
    imageFilter: imageFilter
};