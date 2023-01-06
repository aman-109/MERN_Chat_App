

import { Box } from '@chakra-ui/react'
import React from 'react'
import { useContext } from 'react'
import SideDrawer from '../Components/Misc/SideDrawer'
import { AppContext } from '../Context/AppContext'

const ChatPage = () => {
    const {user}=useContext(AppContext)
  return (
    <Box w={"100%"}>
        {user&& <SideDrawer/>}
        <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {/* {user&& <UserChats/>}
        {user&& <ChatBox/>} */}
            
        </Box>

    </Box>
  )
}

export default ChatPage

