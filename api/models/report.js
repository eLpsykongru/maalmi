const mongoose= require('mongoose');

const reportSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service',
        required:true
    },
    artisan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Artisan',
        required:true
    },
    issues:String,
    payment:{
        type:String,
        required:true
    }, 
    date: { type: Date, default: Date.now },
    startDate:{ type:Date},
    finishDate:{type:Date}
});

const Report = mongoose.model('Report',reportSchema);
module.exports=Report;