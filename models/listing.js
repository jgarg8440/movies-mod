const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    writer: String,
    actors: String,
    poster: String,
});

module.exports = mongoose.model('Listing', listingSchema);
