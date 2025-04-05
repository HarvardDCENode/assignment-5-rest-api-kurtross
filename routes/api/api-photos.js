var express = require('express');
var router = express.Router();
var photoController = require('../../controllers/photoController');
var Photo = require('../../models/photoModel');
const mongoose = require('mongoose');

// API routing

// read all photos
router.get('/', (req, res, next) => {
    Photo.find({})
        .then((photos) => {
            res.status(200).json(photos); // Return photos as JSON
        })
        .catch((err) => {
            console.error("Error retrieving photos:", err);
            res.status(500).json({ error: "error retrieving photos" });
        });
});

// read photo by id
router.get('/:id', (req, res, next) => {
    Photo.findById(req.params.id)
        .then((photo) => {
            if (!photo) {
                return res.status(404).json({ error: "Photo not found" });
            }
            res.status(200).json(photo); // Return the photo as JSON
        })
        .catch((err) => {
            console.error("Error retrieving photo:", err);
            res.status(500).json({ error: "error retrieving photo" });
        });
});

// create a new photo
router.post('/', (req, res, next) => {
    const photo = new Photo({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        imageurl: req.body.imageurl, // Assuming the image URL is sent in the request body
        mimetype: req.body.mimetype,
        size: req.body.size
    });

    photo.save()
        .then((savedPhoto) => {
            res.status(201).json(savedPhoto); // Return the saved photo as JSON
        })
        .catch((err) => {
            console.error("Error saving photo:", err);
            res.status(500).json({ error: "error saving photo" });
        });
});

// update a photo by ID
router.put('/:id', (req, res, next) => {
    Photo.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedPhoto) => {
            if (!updatedPhoto) {
                return res.status(404).json({ error: "photo not found" });
            }
            res.status(200).json(updatedPhoto); // Return the updated photo as JSON
        })
        .catch((err) => {
            console.error("Error updating photo:", err);
            res.status(500).json({ error: "error updating photo" });
        });
});

// delete a photo by ID
router.delete('/:id', (req, res, next) => {
    Photo.findByIdAndDelete(req.params.id)
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