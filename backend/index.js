const express= require("express")
const connect = require("./config/db")
const cors =require("cors")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
require("dotenv").config()
const userRoutes=require("./routes/userRoutes")

const PORT=process.env.PORT || 5000

connect()
const app=express()
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(cors())

app.use("/api/user",userRoutes)

// error handling
app.use(notFound)
app.use(errorHandler)


app.listen(PORT,console.log(`Server Started on PORT ${PORT}`))