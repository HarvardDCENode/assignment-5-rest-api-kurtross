var express = require('express');
var router = express.Router();
var photoController = require('../../controllers/photoController');
var PhotoService = require('../../services/photoService');

// API routing

// read all photos
router.get('/', (req, res, next) => {
    console.log("GET /api/photos route hit");
    PhotoService.getAllPhotos()
        .then((photos) => {
            console.log("Photos retrieved:", photos);
            res.status(200).json(photos);
        })
        .catch((err) => {
            console.error("Error retrieving photos:", err);
            res.status(500).json({ error: "error retrieving photos" });
        });
});

// read photo by id
router.get('/:id', (req, res, next) => {
    PhotoService.getPhotoById(req.params.id)
        .then((photo) => {
            if (!photo) {
                return res.status(404).json({ error: "Photo not found" });
            }
            res.status(200).json(photo);
        })
        .catch((err) => {
            console.error("Error retrieving photo:", err);
            res.status(500).json({ error: "error retrieving photo" });
        });
});

// create a new photo
router.post('/', (req, res, next) => {
    const photoData = {
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        imageurl: req.body.imageurl, 
        mimetype: req.body.mimetype,
        size: req.body.size
    };

    PhotoService.createPhoto(photoData)
        .then((savedPhoto) => {
            res.status(201).json(savedPhoto);
        })
        .catch((err) => {
            console.error("Error saving photo:", err);
            res.status(500).json({ error: "error saving photo" });
        });
});

// update a photo by ID
router.put('/:id', (req, res, next) => {
    PhotoService.updatePhotoById(req.params.id, req.body)
        .then((updatedPhoto) => {
            if (!updatedPhoto) {
                return res.status(404).json({ error: "photo not found" });
            }
            res.status(200).json(updatedPhoto);
        })
        .catch((err) => {
            console.error("Error updating photo:", err);
            res.status(500).json({ error: "error updating photo" });
        });
});

// delete a photo by ID
router.delete('/:id', (req, res, next) => {
    PhotoService.deletePhotoById(req.params.id)
        .then((deletedPhoto) => {
            if (!deletedPhoto) {
                return res.status(404).json({ error: "Photo not found" });
            }
            res.status(200).json({ message: "photo deleted successfully" });
        })
        .catch((err) => {
            console.error("Error deleting photo:", err);
            res.status(500).json({ error: "error deleting photo" });
        });
});

module.exports = router;