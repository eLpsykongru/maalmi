const mongoose= require('mongoose');


const reportsSchema = new mongoose.Schema({
   
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
    },
    artisan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Artisans',
    },
    
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Services',
    },
    serviceRequest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ServiceRequests',
    },
    
    title:{
        type:String,
        
    },
    issues:{
        type:String,
        
    },
  
    reportDate:{ type: Date, default: Date.now },
    description:{
        type:String,
        
    },
    status:{type:String,enum:['Pending','Resolved'],default:'Pending'},
});

reportsSchema.methods.isValidStatus = function(status){
    return this.status === status;
}

reportsSchema.pre('save', function(next) {
    if (!this.issues) {
        this.issues = "NuLL";
    }
    next();
});
 

const Reports = mongoose.model('Reports',reportsSchema);
module.exports=Reports;