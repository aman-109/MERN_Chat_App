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
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../Animation/TypingComponent.json"


const ENDPOINT = "http://localhost:5000"
var socket,SelectedChatCompare


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const toast = useToast();

  const { selectedChat, setSelectedChat, user,notification,setNotification } = useContext(AppContext);

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


  useEffect(()=>{
    socket=io(ENDPOINT)
    socket.emit("setup",user)
    socket.on("connected",()=>setSocketConnected(true))
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
  },[])

  useEffect(()=>{
    fetchAllMessages()
    SelectedChatCompare=selectedChat
      },[selectedChat])
    

  useEffect(() => {
  socket.on("message recieved",(newMessageRecived)=>{
    if(!SelectedChatCompare || SelectedChatCompare._id !== newMessageRecived.chat._id){
      //give notification
      if(!notification.includes(newMessageRecived)){
        setNotification([newMessageRecived,...notification])
        setFetchAgain(!fetchAgain)
      }
    }else{
      setMessages([...messages,newMessageRecived])
    }
  })
  })
  
  const fetchAllMessages=async()=>{
    if(!selectedChat) return;
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`,
      {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setMessages(data)
        setLoading(false)
        socket.emit("join chat",selectedChat._id)
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
      socket.emit("stop typing",selectedChat._id)
      try {
        setNewMessage("")
        const { data } = await axios.post(`/api/message`,{
          content: newMessage,
          chatId: selectedChat._id,
        },
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          socket.emit("new message",data)
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

    if(!socketConnected) return ;
    if(!typing){
      setTyping(true)
      socket.emit("typing",selectedChat._id)
    }

    // debouncing /throttling function that
    //stops typing after 3000
    //after user stops typing

    let lastTypingTime=new Date().getTime()
    var timerLength=3000;
    setTimeout(() => {

      var currentTime=new Date().getTime()

      var timeDifference =currentTime-lastTypingTime

      if(timeDifference>= timerLength && typing){
        socket.emit("stop typing",selectedChat._id)
        setTyping(false)
      }
      
    }, timerLength);

  }




 

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
            { messages && (!selectedChat.isGroupChat ? (
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
            ))}
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
              {isTyping ? <div>
                    <Lottie
                    options={defaultOptions}
                    height="30px"
                    width={"70px"}
                    style={{marginBottom:"15px",marginLeft:"0px"}}
                    />
              </div> : <></>}
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
