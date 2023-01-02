const express=require("express")
const { registerUser, loginUser } = require("../controllers/authController")

const router=express.Router()

router
.post("/",registerUser)
.post("/login",loginUser)

module.exports=router
