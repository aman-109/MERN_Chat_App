import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { getSender, getWholeSender } from "../Utils/Utils";
import ProfileModal from "./Misc/ProfileModal";
import UpdateGroupChatModal from "./Misc/UpdateGroupChatModal";
import axios from "axios";
import { useEffect } from "react";
import ChatMessages from "./ChatMessages";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = useContext(AppContext);

  const fetchAllMessages=async()=>{
    if(!selectedChat) return;
    try {
      setLoading(true);

      const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,
      {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setMessages(data)
        setLoading(false)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  const sendMessageFun=async(event)=>{
    if(event.key==="Enter" && newMessage){
      try {
        setNewMessage("")
        const { data } = await axios.post(`http://localhost:5000/api/message`,{
          content: newMessage,
          chatId: selectedChat._id,
        },
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          console.log(data)
          setMessages([...messages,data])
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  const typingHandler=(e)=>{
    setNewMessage(e.target.value)
  }



  useEffect(()=>{
fetchAllMessages()
  },[selectedChat])


  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Open sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {/* chat name logic here */}
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getWholeSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchAllMessages={fetchAllMessages}
                />
              </>
            )}
          </Text>

          {/* chat box message Ui */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* messages here */}
            {
              loading ? (
                <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
                alignSelf="center"
                margin="auto"
                />
              ) : (
                <Box
                  display="flex" 
                  flexDirection={"column"}
                  overflowY="scroll"
                  // scrollbarWidth="none"
                >
                  {/* messages */}
                  <ChatMessages messages={messages}/>
             
                </Box>
              )
            }
            
            {/* input typing box */}
            <FormControl onKeyDown={sendMessageFun} isRequired mt={3}>
              <Input
               variant="filled"
               bg="gray.300"
               placeholder="Enter a message.."
               value={newMessage}
               onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Open sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
