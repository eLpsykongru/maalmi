const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  adresse: {
    type: String,
  },
  verificationToken: String,
  profileImage: String,
  userRate: Number,
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],

  announces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Announce',
    },
  ],
  sentAnnounceRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Announce',
    },
  ],
  receivedAnnounceRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AnnounceArtisan',
    },
  ],
  registerDate: {
    type: Date,
    default: Date.now,
  },
  
});

const User = mongoose.model("User", userSchema);

module.exports = User;
