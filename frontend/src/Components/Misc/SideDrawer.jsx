

import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'
import UserItem from '../User/UserItem'
import ProfileModal from './ProfileModal'
import SkeletonCom from './SkeletonCom'

const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [searchText,setSearchText]=useState("")
    const [loading,setLoading]=useState(false)
    const [chatLoading,setChatLoading]=useState(false)
    const [result,setResult]=useState([])
    const { setSelectedChat,user, chats, setChats,}=useContext(AppContext)
    const navigate=useNavigate()
    const toast=useToast()

 
  const logoutHandler=()=>{
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const handleSearch=async()=>{
    if (!searchText) {
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }

      try {
        setLoading(true)
        const {data}=await axios.get(`http://localhost:5000/api/user?search=${searchText}`,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })
        console.log(data)
        setLoading(false)
        setResult(data)
    } catch (error) {
          setLoading(false)
          toast({
            title: "Error Occured!",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        
      }
  }

  const fetchUserChat=async(userId)=>{
    try {
        setChatLoading(true)
        const {data}=await axios.post("http://localhost:5000/api/chat",{userId},{
            headers:{
                "Content-type":"application/json",
                Authorization:`Bearer ${user.token}`
            }
        })
        // console.log(data)
        if(!chats.find((c)=>c._id ===data._id)) setChats([data,...chats])
        setSelectedChat(data)
        setChatLoading(false)
        onClose()
    } catch (error) {
        toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
    }
  }


  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {/* Search Button */}
            <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon/>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          I-We-Chat
        </Text>

       
        <Box>
            {/* Notification */}
          <Menu>
            <MenuButton p={1}>
             
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
           
          </Menu>

          {/* Profile */}
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

        {/* User Search Drawer */}
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>

            <Input placeholder='Search By name or email' mr={2} value={searchText} onChange={(e)=>setSearchText(e.target.value)} />
            <Button onClick={handleSearch}>Find</Button>
            </Box>

            {/* Loading Skeleton */}
            {
                loading ? (
                    <SkeletonCom/>
                ) : (
                    result?.map((item)=>(
                        <UserItem key={item._id} user={item} handleChat={()=>fetchUserChat(item._id)}/>
                    ))
                )
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>


    </>
  )
}

export default SideDrawer