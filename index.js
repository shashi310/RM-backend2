const express= require('express');
const { connection } = require('./db');
require("dotenv").config();
const cors= require('cors');
const { userRouter } = require('./Routes/user.routes');
const { blogRouter } = require('./Routes/blog.routes');


const app = express();
app.use(cors());
app.use(express.json());
app.use("/users",userRouter)
app.use("/blogs",blogRouter)

app.get("/",(req,res)=>{
    res.json({msg:"Welcome to the RM mock-2 Backend"})
    
})

app.listen(8080,async()=>{
    try {
        await connection;
        console.log(`DB Connected.\nServer is running at port 8080`);
    } catch (error) {
        console.log(error);
    }
})
