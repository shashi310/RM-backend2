const express=require('express');
const { Auth } = require('../Middlewares/Auth.middleware');
const { BlackListAuth } = require('../Middlewares/Blacklist.middleware');
const { BlogModel } = require('../Models/blogs.model');



const blogRouter=express.Router();
blogRouter.use(Auth)
blogRouter.use(BlackListAuth)


blogRouter.get("/", async(req, res) =>{
    // filter
    const category=req.query.category;
    const categoryfilter= category ? {category} :{};
    
    // sort
    const sort=req.query.sortBy==="date" ? {date:1} :{};

    // search
    const search= req.query.search ? {title:{$regex:new RegExp(req.query.search,"i")}} : {}


    try {
        const findAll= await BlogModel.find({...search,...categoryfilter}).sort(sort);
    
    if(findAll){
        res.json({blogs:findAll})
    }else{
        res.json({msg:"something went wrong"})
    }
    } catch (error) {
        res.status(400).json({err:error.message}) 
    }
})



blogRouter.post("/add", async(req, res) => {
try {
    const blog=new BlogModel(req.body)
    await blog.save()
    res.json({msg:`${blog.title} blog created successfully`,blog})
} catch (error) {
    res.status(400).json({err:error.message})
}
})

blogRouter.patch("/update/:id",async (req, res) =>{
    const {id}=req.params;
    const {title,content,category,date,likes,userID}=req.body;
    const updateQuery={}

    if(title){
        updateQuery.title=title
    }
    if(content){
        updateQuery.content=content
    }
    if(category){
        updateQuery.category=category
    }
    if(date){
        updateQuery.date=date
    }
    if(likes){
        updateQuery.likes=likes
    }try {
        const updateblog= await BlogModel.findOneAndUpdate({_id:id,userID}, updateQuery)
        if(updateblog){
            res.json({msg:"blog updated successfully"})
        }else{
            res.json({msg:"blog not found"})
        }
    } catch (error) {
        res.status(400).json({err:error.message})
    }
})



blogRouter.delete("/delete/:id",async (req, res) =>{
    
const {userID}= req.body;
const {id}= req.params


    try {
        const deletedBlog= await BlogModel.findOneAndDelete({_id:id,userID});
        if(deletedBlog){
            res.json({msg:"Blog deleted successfully"})
        }else{
            res.json({msg:"blog not found"})
        }
    } catch (error) {
        res.status(400).json({err:error.message})
    }
})


module.exports ={blogRouter}