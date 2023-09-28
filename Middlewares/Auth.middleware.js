const  jwt=require("jsonwebtoken");

function Auth(req, res ,next) {
const token =req.headers.authorization?.split(" ")[1]
if(token){
    jwt.verify(token,process.env.secrectKey,(err,decoded)=>{
        if(decoded){
            req.body.userID=decoded.userID
            req.body.userName=decoded.userName
            next()
        }else{
            res.json({msg:"You are not authorized to access this"})
        }
    })
}else{
    res.json({msg:"Kindly login again"})
}
}

module.exports = {Auth}