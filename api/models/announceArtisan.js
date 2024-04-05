const mongoose = require('mongoose');

const announceArtisanSchema = new mongoose.Schema({
    artisan:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artisan",
        required: true
    },
    userAnnounce:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    priceOffered:{
        type: Number,
        required: true
    },
    description: String,
    media: String,
    createdAt: [{
        type:Date,
        default: Date.now
    }]
});

const AnnounceArtisan = mongoose.model('AnnounceArtisan', announceArtisanSchema);
module.exports= AnnounceArtisan; 