const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mimetype: { type: String, required: true },
    imageurl: { type: String, required: true },
    size: { type: Number, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: false }
});

module.exports = mongoose.model('Photo', photoSchema);