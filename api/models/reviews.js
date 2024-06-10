const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  title: String,
  content: String,
  rating: { type: Number, min: 1, max: 5 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisans' },
  recomended:{ type: Boolean},
  date: { type: Date, default: Date.now },
});



const Reviews = mongoose.model('Reviews', reviewsSchema);

module.exports = Reviews;
