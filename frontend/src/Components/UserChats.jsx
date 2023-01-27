import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { AddIcon } from "@chakra-ui/icons";
import SkeletonCom from "../Components/Misc/SkeletonCom";
import { getSender } from "../Utils/Utils";
import { useEffect } from "react";
import axios from "axios";
import GroupChatModel from "./Misc/GroupChatModel";
const UserChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat,setSelectedChat, chats,setChats ,user} = useContext(AppContext);
  const toast=useToast()

  const getChats=async()=>{
    try {
        const { data } = await axios.get("/api/chat", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          setChats(data)

    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          })
    }
  }


  useEffect(()=>{
    let loginUser=JSON.parse(localStorage.getItem("userInfo"))
    setLoggedUser(loginUser)
    getChats()
  },[fetchAgain])


  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "25px", md: "27px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
          </GroupChatModel>
        </Box>

        {/* users chats */}
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflow="scroll" >
              {chats?.map((ele) => (
                <Box
                  onClick={() => setSelectedChat(ele)}
                  cursor="pointer"
                  bg={selectedChat === ele ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === ele ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={ele._id}
                >
                  <Text>
                    {!ele.isGroupChat
                      ? getSender(loggedUser, ele.users)
                      : ele.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <SkeletonCom />
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserChats;
