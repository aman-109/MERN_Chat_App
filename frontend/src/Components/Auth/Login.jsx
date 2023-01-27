import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const toast=useToast()
  const navigate=useNavigate()
  const [loading,setLoading]=useState(false)

  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)
    if (!state.email || !state.password ) {
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
   

    try{
      let body={
        email:state.email,
        password:state.password,
      }
      
      const data=await axios.post("/api/user/login",body,{
        headers:{
          "Content-type": "application/json",
        }
      })
      console.log(data.data)
      toast({
        title: "Login Successful",
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
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <VStack spacing="5px">
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={state.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter Your Password"
                name="password"
                value={state.password}
                onChange={handleChange}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  variant="outline"
                  border="none"
                  onClick={() => setShow(!show)}
                >
                  {!show ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          

          <Stack w="100%">
            <Button
              colorScheme={"blue"}
              width="100%"
              // mt={15}
              type="submit"
            >
              Login 
            </Button>
            <Button
              variant="solid"
              colorScheme={"green"}
              width="100%"
              // mt={15}
             onClick={()=>{
              setState({
                email:"guestuser@gmail.com",
                password:"Guest123"
              })
             }}
            >
              Login as Guest 
            </Button>
          </Stack>
        </VStack>
      </form>
    </>
  );
};

export default Login;
