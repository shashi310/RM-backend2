const mongoose = require('mongoose')

const blogSchema=mongoose.Schema({
    title:{type:String, required:true},
    content:{type:String, required:true},
    category:{type:String, required:true},
    date:{type:String, required:true},
    likes:{type:Number, required:true},
    userID:{type:String, required:true},
    userName:{type:String, required:true}

},
{versionKey:false}
)

const BlogModel= mongoose.model("blog",blogSchema)

module.exports = {BlogModel}