const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");

//@description     Create or access 1 v 1 Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId Param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const newChat = await Chat.create(chatData);

      const allChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(allChat);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
});



//@description     Get all chats for a user
//@route           GET /api/chat/
//@access          Protected
const getChats = asyncHandler(async (req, res) => {
  try {
    let chat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).send(chat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});


//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the details" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(200)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const allGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(allGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});


// @description    Rename Group
// @route   PUT /api/chat/group/rename
// @access  Protected
const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      //old :new
      // chatName:chatName
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found !");
  } else {
    res.json(updatedChat);
  }
});


// @desc    Add user to Group 
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  
    // const user= await Chat.find({groupAdmin:{$eq:req.user._id}})

    // if(user.length==0){
    //     res.status(400);
    //     throw new Error("Only admin can add user");
    // }
    // else{
    //     let existingUser = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
       
    //     if(existingUser.length !=0){
    //         res.status(400);
    //         throw new Error("User Already Added in Group");
    //     }else{

            const addUser = await Chat.findByIdAndUpdate(
              chatId,
              {
                $push: { users: userId },
              },
              { new: true }
            )
              .populate("users", "-password")
              .populate("groupAdmin", "-password");
            if (!addUser) {
              res.status(404);
              throw new Error("Chat Not Found");
            } else {
              res.json(addUser);
            }
        // }
       
    // }
});


// @description    Remove user from Group
// @route   PUT /api/chat/removefromgroup
// @access  Protected
const removeFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // const user= await Chat.find({groupAdmin:{$eq:req.user._id}})

  // if(user.length==0){
  //     res.status(400);
  //     throw new Error("Only admin can remove user");
  // }else{

      const removeUser = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!removeUser) {
        res.status(404);
        throw new Error("Chat Not Found");
      } else {
        res.json(removeUser);
      }
  // }
});

module.exports = {
  accessChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroupChat,
};
