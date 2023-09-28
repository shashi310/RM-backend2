const { blacklistModel } = require("../Models/blacklist.model")


async function BlackListAuth(req,res,next){
    const token =req.headers.authorization?.split(" ")[1]
    const {userID}=req.body
    const blacklist= await blacklistModel.findOne({userID})

    if(!blacklist){
        next()
    }else{
        if(blacklist.tokens.includes(token)){
            res.json({msg:"Your token has been blaklisted please Login again"})
        }else{
            next()
        }
    }
}

module.exports = {BlackListAuth}