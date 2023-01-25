import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios'
import UserBadgeItem from "../User/UserBadgeItem";
import UserItem from "../User/UserItem";

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchAllMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();
  
    const { selectedChat, setSelectedChat, user } = useContext(AppContext);
  
  const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
    
        try {
          setLoading(true);
          
          const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`,  {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
        //   console.log(data);
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        }
    };


  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
     
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/group/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
      );

    //   console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };


  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/addtogroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
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
    setGroupChatName("");
  };


  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true)
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/removefromgroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages()
      setLoading(false);
    } catch (error) {
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
    setGroupChatName("");
  };


  return (
    <>
     <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

<Modal onClose={onClose} isOpen={isOpen} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
      fontSize="35px"
      fontFamily="Work sans"
      display="flex"
      justifyContent="center"
    >
      {selectedChat.chatName}
    </ModalHeader>

    <ModalCloseButton />
    <ModalBody display="flex" flexDir="column" alignItems="center">
      <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
        {selectedChat.users.map((u) => (
          <UserBadgeItem
            key={u._id}
            user={u}
            handleFunction={() => handleRemove(u)}
          />
        ))}
      </Box>
      <FormControl display="flex" gap={2}>
        <Input
          placeholder="Chat Name"
          mb={3}
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <Button
          variant="solid"
          colorScheme="teal"
          ml={1}
          isLoading={renameloading}
          onClick={handleRename}
        >
          Update
        </Button>
      </FormControl>
      <FormControl>
        <Input
          placeholder="Add User to group"
          mb={1}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </FormControl>
      <Box w="100%" >
      {loading ? (
        <Spinner size="lg" />
      ) : (
        searchResult?.map((user) => (
          <UserItem
            key={user._id}
            user={user}
            handleChat={() => handleAddUser(user)}
          />
        ))
      )}
      </Box>
    </ModalBody>
    <ModalFooter>
      <Button onClick={() => handleRemove(user)} colorScheme="red">
        Leave Group
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  )
}

export default UpdateGroupChatModal