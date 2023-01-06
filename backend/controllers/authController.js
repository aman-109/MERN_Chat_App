const asyncHandler=require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/user.model");


const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password,pic}=req.body

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
      }

    const existingUser=await User.findOne({email})
    if(existingUser){
        res.status(400)
        throw new Error("User already exists")
    }

    const user=await User.create({ name,email,password,pic})
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
        })
    }
    else{
        res.status(400);
    throw new Error("User not found");
    }
})



const loginUser=asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.verifyPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id,user.name,user.email),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  });
  

  const allUsers=asyncHandler(async (req,res)=>{
    const keyword =req.query.search ? {
      $or:[
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },

      ],
    } : {};

    const users= await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)
  })

  module.exports={registerUser,loginUser,allUsers}