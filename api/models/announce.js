const mongoose = require('mongoose');


const announceSchema = new mongoose.Schema({
    service: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Services',
        
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users",
        
    },
    description:{
        type:String,
        
    },
    media: String,
    priceGiven: Number,
    extraNote: String,
    createdAt: {
        type:Date,
        default: Date.now
    },
    status:{
        type:String,
        enum:['Pending','Accepted','Rejected'],
        default:'Pending'
    },
    

}) 

announceSchema.path('status').validate(function(status){
    return ['Pending','Accepted','Rejected'].includes(status);
},"Invalid Status");







const Announce = mongoose.model('Announce',announceSchema);
module.exports=Announce;