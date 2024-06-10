const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
    serviceName:{
        type:String,
        
    },
    Rate:{ type: Number, min: 1, max: 5 },
    description:{
        type:String,
        required:false
    },
    serviceLogo:String,
    category:{
        type:String,
        
    },
    avgPrice:{
        type:Number,
        
    },
    minPrice:{
        type:Number,
        
    },
    maxPrice:{
        type:Number,
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    
})

const Services = mongoose.model('Services',servicesSchema);
module.exports=Services;