

import { Box } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import Chatbox from '../Components/ChatBox'
import SideDrawer from '../Components/Misc/SideDrawer'
import UserChats from '../Components/UserChats'
import { AppContext } from '../Context/AppContext'

const ChatPage = () => {
    const {user}=useContext(AppContext)
    const [fetchAgain,setFetchAgain]=useState(false)
  return (
    <Box w={"100%"}>
        {user&& <SideDrawer/>}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user&& <UserChats fetchAgain={fetchAgain}/>}
        {user&& <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            
        </Box>

    </Box>
  )
}

export default ChatPage

