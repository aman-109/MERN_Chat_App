const express= require("express")
const { chats } = require("./data/data")
require("dotenv").config()

const app=express()
const PORT=process.env.PORT || 5000

app.get("/",(req,res)=>{
    res.send("Api is running")
})

app.get("/get/chat",(req,res)=>{
    res.send(chats)
})
app.get("/api/chat/:id",(req,res)=>{
    const singleChat=chats.find((c)=>c._id===req.params.id)
   res.send(singleChat)
})



app.listen(PORT,console.log(`Server Started on PORT ${PORT}`))