const mongoose = require('mongoose');


const announceSchema = new mongoose.Schema({
    service: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    description:{
        type:String,
        required:true
    },
    media: String,
    priceGiven: Number,
    extraNote: String,
    createdAt: [{
        type:Date,
        default: Date.now
    }]
    
})

const Announce = mongoose.model('Announce',announceSchema);
module.exports=Announce;