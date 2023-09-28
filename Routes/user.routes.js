const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const UserModel = require('../Models/user.model');
const { Auth } = require('../Middlewares/Auth.middleware');
const { blacklistModel } = require('../Models/blacklist.model');
const { BlackListAuth } = require('../Middlewares/Blacklist.middleware');


const userRouter=express.Router();

userRouter.post("/register", async(req, res) => {
    const {email, password} = req.body;
    
   try {
    const findUser= await UserModel.findOne({email})
    if(findUser){
        res.json({msg:"user already registered , please login"})
        return
    }else{
        bcrypt.hash(password,5,async(err,hash)=>{
            if(hash){
                const user= new UserModel({...req.body,password:hash})
                await user.save()
                if(user){
                    res.json({msg:"User registered",user})
                }else{
                    res.json({msg:"Something went wrong"})
                }
            }else{
                res.json({err:err.message})
            }
        })
    }
   } catch (error) {
    res.status(400).json({err:error.message})
   }
})


userRouter.post("/login",async (req,res)=>{
    const {email, password} = req.body;
    try {
        const findUser= await UserModel.findOne({email})

        if(findUser){
            bcrypt.compare(password,findUser.password, async (err,result)=>{
                if(result){
                    jwt.sign({userID:findUser._id,userName:findUser.name},process.env.secrectKey,{expiresIn:"7d"},(err,token)=>{
                        if(token){
                            res.json({msg:"UserLogged in successfully",token,findUser})
                        }else{
                            res.json({err:err.message})
                            return
                        }
                    })
                }else{
                    res.json({err:err.message})
                }
            })
        }else{
            res.json({msg:"user does not exist"})
        }
    } catch (error) {
        res.status(400).json({err:error.message})
    }

})



userRouter.post("/logout", Auth,  async (req,res)=>{
    const token =req.headers.authorization?.split(" ")[1]
    const {userID,userName}=req.body
    try {
        const blacklist= await blacklistModel.findOne({userID})

        if(blacklist){
            const updateBlacklist=await blacklistModel.findOneAndUpdate({userID},{tokens:[...blacklist.tokens,token]})
            if(updateBlacklist){
                res.json({mag:"User Logged out",blacklist:updateBlacklist})
            }else{
                res.json({msg:"something went wrong"})
            }
        }else{
            const newBlacklist= new blacklistModel({userID,userName,tokens:[token]})
            await newBlacklist.save()

            res.json({msg:"user logged out",blacklist:newBlacklist})
        }
    } catch (error) {
        res.status(400).json({err:error.message})
    }
})

module.exports ={userRouter}