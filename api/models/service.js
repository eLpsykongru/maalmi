const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName:{
        type:String,
        required:true
    },
    Rate:{ type: Number, min: 1, max: 5 },
    description:{
        type:String,
        required:false
    },
    serviceLogo:String,
    category:{
        type:String,
        required:true
    },
    avgPrice:{
        type:Number,
        required:true
    },
    addedDate: {
        type: Date,
        default: Date.now,
      },
    
})

const Service = mongoose.model('Service',serviceSchema);
module.exports=Service;