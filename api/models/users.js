const mongoose = require("mongoose");


const usersSchema = new mongoose.Schema({
  
  phoneNumber: {
    type: String,
    
    unique: true,
  },
  name: {
    type: String,
    
  },
  password: {
    type: String,
    
  },
  city: {
    type: String,
    
  },
  adresse: {
    type: String,
    
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reports",
    },
  ],
  serviceRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequests",
    },
  ],
  announces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announce",
    },
  ],
  receivedAnnounces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnnounceArtisan",
    },
  ],
  
registerDate: {
    type: Date,
    default: Date.now,
  },
});


const Users = mongoose.model("Users", usersSchema);


module.exports = Users;
