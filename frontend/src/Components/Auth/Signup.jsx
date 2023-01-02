import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import {ViewIcon,ViewOffIcon} from "@chakra-ui/icons"

const Signup = () => {
  const [state,setState]=useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",

  })
  const [profile,setProfile]=useState()
  const [show,setShow]=useState(false)

  const handleChange=(e)=>{
    const {name,value}=e.target
    setState({
      ...state,
      [name]:value
    })
  }
  const postProfilePic=(pic)=>{

  }

  const handleSubmit=(e)=>{
    e.preventDefault()
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