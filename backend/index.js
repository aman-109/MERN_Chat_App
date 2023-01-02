const express= require("express")
const connect = require("./config/db")
require("dotenv").config()
const userRoutes=require("./routes/userRoutes")
const PORT=process.env.PORT || 5000
connect()
const app=express()
app.use(express.json())


app.use("/api/user",userRoutes)



app.listen(PORT,console.log(`Server Started on PORT ${PORT}`))