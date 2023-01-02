import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
                value={state.confirmPassword}
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
                email:"aman.mate.50@gmail.com",
                password:"amanmate"
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
