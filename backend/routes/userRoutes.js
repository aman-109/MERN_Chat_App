const express=require("express")
const { registerUser, loginUser,allUsers } = require("../controllers/authController")
const { authMiddleware } = require("../middleware/authMiddleware")

const router=express.Router()

router
.get("/",authMiddleware,allUsers)
.post("/",registerUser)
.post("/login",loginUser)


module.exports=router
