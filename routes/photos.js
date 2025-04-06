var express = require('express');
var router = express.Router();
var flash = require('express-flash');
var multer = require('multer');
var photoController = require('../controllers/photoController');
var PhotoService = require('../services/photoService');

var upload = multer({
    storage: photoController.storage,
    fileFilter: photoController.imageFilter
});

// flash messaging
router.use(flash());

router.get('/', (req, res, next) => {
    PhotoService.getAllPhotos()
        .then((photos) => {
            console.log("Photos retrieved:", photos);
            res.render('photos', {
                photos: photos,
                flashMsg: req.flash('fileUploadError')
            });
        })
        .catch((err) => {
            console.error("Error retrieving photos:", err);
            res.status(500).send("Error retrieving photos"); 
        });
});

router.post('/', upload.single('image'), (req, res, next) => {
    if (!req.file) {
        req.flash('fileUploadError', 'No file uploaded');
        return res.redirect('/photos');
    }

    var path = "/static/img/" + req.file.filename;
    var photoData = {
        name: req.file.originalname,
        mimetype: req.file.mimetype,
        imageurl: path,
        size: req.file.size,
        description: req.body.description,
        date: req.body.date
    };

    PhotoService.createPhoto(photoData)
        .then(() => {
            res.redirect('/photos');
        })
        .catch((err) => {
            console.log(err);
            next(new Error("PhotoSaveError"));
        });
});

// get form to update a photo
router.get('/edit/:id', (req, res, next) => {
    PhotoService.getPhotoById(req.params.id)
        .then((photo) => {
            if (!photo) {
                req.flash('fileUploadError', 'Photo not found');
                return res.redirect('/photos');
            }
            res.render('editPhoto', { photo: photo });
        })
        .catch((err) => {
            console.log(err);
            res.end("Error retrieving photo for editing");
        });
});

// post updated photo data
router.post('/edit/:id', (req, res, next) => {
    PhotoService.updatePhotoById(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        date: req.body.date
    })
        .then(() => {
            res.redirect('/photos');
        })
        .catch((err) => {
            console.log(err);
            req.flash('fileUploadError', 'Error updating photo');
            res.redirect('/photos');
        });
});

// post to delete a photo
router.post('/delete/:id', (req, res, next) => {
    PhotoService.deletePhotoById(req.params.id)
        .then(() => {
            res.redirect('/photos');
        })
        .catch((err) => {
            console.log(err);
            res.end("Error deleting photo");
        });
});

//handle errors
router.use(function(err, req, res, next) {
    console.error(err.stack);
    if (err.message == "only image files allowed") {
        req.flash('fileUploadError', 'Only image files are allowed');
        res.redirect('/photos');
    } else if (err.message == "PhotoSaveError") {
        req.flash('fileUploadError', 'error saving photo to database');
        res.redirect('/photos');
    } else {
        next(err);
    }
});

module.exports = router;