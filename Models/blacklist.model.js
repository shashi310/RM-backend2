const mongoose= require('mongoose');

const blacklistSchema= mongoose.Schema({
    userID:{type:String,required:true},
    userName:{type:String,required:true},
    tokens:{type:Array,required:true},
},{versionKey:false});

const blacklistModel= mongoose.model('blacklist',blacklistSchema);

module.exports ={blacklistModel}
