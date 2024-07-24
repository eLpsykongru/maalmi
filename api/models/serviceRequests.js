 
const mongoose  = require('mongoose');



const serviceRequestsSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Services',
        
    }, 
    artisan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Artisans',
        
    },
    reports:[{
         type: mongoose.Schema.Types.ObjectId, 
         ref: "Reports" 
    }], 
    timeTaken:{type : Date},
    price:{type:Number},
    requestDate:{ type: Date, default: Date.now }, 
    status:{type:String,enum:['Pending','Accepted','Rejected','Completed'],default:'Pending'},
    rate:{ type: Number, min: 1, max: 5 },
});

serviceRequestsSchema.methods.isValidStatus = function(status){
   return this.status === status;
}

const ServiceRequest = mongoose.model('ServiceRequests',serviceRequestsSchema);
 module.exports=ServiceRequest;