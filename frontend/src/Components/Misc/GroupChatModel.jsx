import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
    Spinner,
  } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from 'react'
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import UserBadgeItem from "../User/UserBadgeItem";
import UserItem from "../User/UserItem";

const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();



    const { user, chats, setChats } =useContext(AppContext)

    const handleSearch= async(query)=>{
        setSearch(query)
        if(!query) return;

        try {
            setLoading(true)
            const {data}=await axios.get(`/api/user?search=${search}`,{
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            })
            console.log(data)
            setLoading(false)
            setSearchResult(data)

        } catch (error) {
            setLoading(false)
            toast({
              title: "Error Occured!",
              description: "Failed to Load the Search Results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
        }

    }


    const handleSubmit=async()=>{
        if (!groupChatName || !selectedUsers) {
            toast({
              title: "Please fill all the feilds",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }

          try {
            
            const { data } = await axios.post(
              `/api/chat/group`,
              {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
              },{
              headers: {
                Authorization: `Bearer ${user.token}`,
              }}
            );
            setChats([data, ...chats]);
            onClose();
            toast({
              title: "New Group Chat Created!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } catch (error) {
            toast({
              title: "Failed to Create the Chat!",
              description: error.response.data,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
    }

    const handleDelete=(userToDelete)=>{
        setSelectedUsers(selectedUsers.filter((ele)=>ele._id !== userToDelete._id))
    }
    
    const handleGroup=(userToAdd)=>{
        if (selectedUsers.includes(userToAdd)) {
            toast({
              title: "User already added",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }
  return (
    <>
     <span onClick={onOpen}>{children}</span>

<Modal onClose={onClose} isOpen={isOpen} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
      fontSize="35px"
      fontFamily="Open sans"
      display="flex"
      justifyContent="center"
    >
      Create Group Chat
    </ModalHeader>
    <ModalCloseButton />
    <ModalBody display="flex" flexDir="column" alignItems="center">
      <FormControl>
        <Input
          placeholder="Chat Name"
          mb={3}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <Input
          placeholder="Add Users"
          mb={1}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </FormControl>
      <Box w="100%" display="flex" flexWrap="wrap">
        {selectedUsers.map((u) => (
          <UserBadgeItem
            key={u._id}
            user={u}
            handleFunction={() => handleDelete(u)}
          />
        ))}
      </Box>
      <Box w="100%" >

      {loading ? (
        // <ChatLoading />
        <Spinner/>
        
      ) : (
        searchResult
          ?.slice(0, 3)
          .map((item) => (
            <UserItem
              key={item._id}
              user={item}
              handleChat={() => handleGroup(item)}
            />
          ))
      )}
      </Box>
    </ModalBody>
    <ModalFooter>
      <Button onClick={handleSubmit} colorScheme="blue">
        Create Chat
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  )
}

export default GroupChatModel