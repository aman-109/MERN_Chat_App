import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import {ViewIcon,ViewOffIcon} from "@chakra-ui/icons"
import {useNavigate} from "react-router-dom"
import axios from 'axios'

const Signup = () => {
  const [state,setState]=useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",

  })
  const toast=useToast()
  const [profile,setProfile]=useState()
  const [isLoading,setLoading]=useState(false)
  const [show,setShow]=useState(false)
  const navigate=useNavigate()

  const handleChange=(e)=>{
    const {name,value}=e.target
    setState({
      ...state,
      [name]:value
    })
  }
  const postProfilePic=(pics)=>{
    setLoading(true)
    if(pics===undefined){
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if(pics.type==="image/png" || pics.type==="image/jpeg" || pics.type==="image/jpg")
    {
      const data=new FormData()
      data.append("file",pics)
      data.append("upload_preset","IweChat_App")
      data.append("cloud_name","dh3l8fga0")
      fetch("https://api.cloudinary.com/v1_1/dh3l8fga0/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data.url.toString());
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
    else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  }

  const handleSubmit=async (e)=>{
    e.preventDefault()
    if (!state.name || !state.email || !state.password || !state.confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (state.password !== state.confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try{
      let body={
        name:state.name,
        email:state.email,
        password:state.password,
        pic:profile
      }
      
      const data=await axios.post("http://localhost:5000/api/user",body,{
        headers:{
          "Content-type": "application/json",
        }
      })
      console.log(data.data)
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      setLoading(false)
      navigate("/chats")
    }catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
    <VStack spacing='5px'>
      <FormControl id="first_name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
        type="text"
        placeholder='Enter Your Name'
        name="name"
        value={state.name}
        onChange={handleChange}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
        type="email"
        placeholder='Enter Your Email'
        name="email"
        value={state.email}
        onChange={handleChange}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
        type="password"
        placeholder='Enter Your Password'
        name="password"
        value={state.password}
        onChange={handleChange}
        /> 
      </FormControl>
      
      <FormControl id="confirm_password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
        <Input
        type={show?"text":"password"}
        placeholder='Confirm Your Password'
        name="confirmPassword"
        value={state.confirmPassword}
        onChange={handleChange}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" variant="outline" border="none" onClick={()=>setShow(!show)}>
              {!show ? <ViewOffIcon/> :<ViewIcon/>}
          </Button>
        </InputRightElement>
        
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
        type="file"
        p={1}
        accept='image/*'
        onChange={(e)=>postProfilePic(e.target.files[0])}
        /> 
      </FormControl>
      <Stack w="100%">

      <Button colorScheme={"blue"}
      width="100%"
      // mt={15}
    type="submit"
      >
        Sign Up
      </Button>
      </Stack>
      
    </VStack>
      </form>
      </>
  )
}

export default Signup