//note to self: go remove mongoose methods from photos.js and api-photos.js now that there's a service layer

const Photo = require('../models/photoModel');

class PhotoService {
    static async getAllPhotos() {
        return Photo.find({});
    }

    static async getPhotoById(id) {
        return Photo.findById(id);
    }

    static async createPhoto(photoData) {
        const photo = new Photo(photoData);
        return photo.save();
    }

    static async updatePhotoById(id, updateData) {
        return Photo.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deletePhotoById(id) {
        return Photo.findByIdAndDelete(id);
    }
}

module.exports = PhotoService;