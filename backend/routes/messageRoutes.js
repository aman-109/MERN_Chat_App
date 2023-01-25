const express=require("express")

const {authMiddleware} =require("../middleware/authMiddleware")
const {sendMessage,getAllMessages}=require("../controllers/MessageController")
const router=express.Router()

router
.post("/",authMiddleware,sendMessage)
.get("/:chatId",authMiddleware,getAllMessages)

module.exports=router