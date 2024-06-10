const mongoose = require("mongoose");

const artisansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rate: { type: Number, min: 1, max: 5 },
  imageProfile: String,
  email: {
    type: String,
    unique: true,
    required: true,
    
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    
  },
  availabilty: {
    type: Boolean,
    default: false,
    required: true,
  },
  address: {
     type: String, 
     
  },
  city:{
    type :String,

  },
  about: String,
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Services" }],
  registerDate: 
    {
      type: Date,
      default: Date.now,
    },
  
} );
const Artisans = mongoose.model("Artisans", artisansSchema);

module.exports = Artisans;
  