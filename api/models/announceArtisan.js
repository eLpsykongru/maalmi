const mongoose = require('mongoose');

const announceArtisanSchema = new mongoose.Schema({
    artisan:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artisans",
        
    },
    userAnnounce:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announce',
        
    },
    serviceProvided:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services',
         
    },
    priceOffered:{
        type: Number,
        
    },
    description: String,
    media: String,
    respondDate: {
        type:Date,
        default: Date.now
    },
    status:{
        type:String,
        enum:['Pending','Accepted','Rejected'],
        default:'Pending'
    },
    respondTime:Date,
});
 
announceArtisanSchema.path('status').validate(function(status){
    return ['Pending','Accepted','Rejected'].includes(status);
},"Invalid Status");
 

const AnnounceArtisan = mongoose.model('AnnounceArtisan', announceArtisanSchema);
module.exports= AnnounceArtisan; 