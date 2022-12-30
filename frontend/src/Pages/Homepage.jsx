import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";

const Homepage = () => {
  return (
    <Container maxW="xl" textAlign="center" centerContent>
      {/* App Title */}
      <Box
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        justifyContent="center"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4Xl" fontFamily="Open Sans" color="black">
          I-We-Chat
        </Text>
      </Box>
      {/* Login Signup Tabs */}
      <Box bg="white" w="100%" p={4} color="black" borderRadius="lg" borderWidth="1px">
        <Tabs variant="enclosed">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* login */}
              <Login/>
            </TabPanel>
            <TabPanel>
             {/* signup */}
             <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
