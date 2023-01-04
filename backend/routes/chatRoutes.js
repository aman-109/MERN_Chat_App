const express=require("express")
const { accessChat, getChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroupChat } = require("../controllers/chatController")
const { authMiddleware } = require("../middleware/authMiddleware")


const router=express.Router()


router
.post("/",authMiddleware,accessChat)
.get("/",authMiddleware,getChats)
.post("/group",authMiddleware,createGroupChat)
.put("/group/rename",authMiddleware,renameGroupChat)
.put("/addtogroup",authMiddleware,addToGroup)
.put("/removefromgroup",authMiddleware,removeFromGroupChat)

module.exports=router