const express= require("express")
const connect = require("./config/db")
const cors =require("cors")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
require("dotenv").config()
const userRoutes=require("./routes/userRoutes")
const chatRoutes=require("./routes/chatRoutes")
const messageRoutes=require("./routes/messageRoutes")

const PORT=process.env.PORT || 5000

connect()
const app=express()
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(cors())

app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)

// error handling
app.use(notFound)
app.use(errorHandler)


const server=app.listen(PORT,console.log(`Server Started on PORT ${PORT}`))

const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        socket.emit("connected")
    })


    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("user joined " + room);
    })

    //socket for typing
    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

    socket.on("new message",(newMsgRecieved)=>{
        var chat=newMsgRecieved.chat

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user=>{
            if(user._id == newMsgRecieved.sender._id) return

            socket.in(user._id).emit("message recieved",newMsgRecieved)
        })
    })


    socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._d)
    })
})
