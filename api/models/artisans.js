const mongoose = require("mongoose");
const ServiceRequest = require("./serviceRequests");
const Reviews = require("./reviews");

const artisansSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  rate: { type: Number, min: 1, max: 5 },
  imageProfile: String,
  email: {
    type: String,
    unique: true,
    
    
  },
  phoneNumber: {
    type: String,
    
  },
  password: {
    type: String,
    
    
  },
  availabilty: {
    type: Boolean,
    default: false,
    
  },
  address: {
     type: String, 
     
  },
  city:{
    type :String,

  },
  about: String,
  sentAnnounce: [{ type: mongoose.Schema.Types.ObjectId, ref: "AnnounceArtisans" }],
  serviceRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequests" }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Services" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
  registerDate: 
    {
      type: Date,
      default: Date.now,
    },
  reportsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reports" }],
} );
const Artisans = mongoose.model("Artisans", artisansSchema);

 

module.exports = Artisans;
  