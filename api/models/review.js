const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: String,
  content: String,
  rating: { type: Number, min: 1, max: 5 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan' },
  recomended:{ type: Boolean},
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
