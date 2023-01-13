


import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { getSender, getWholeSender } from '../Utils/Utils'
import ProfileModal from './Misc/ProfileModal'
import UpdateGroupChatModal from './Misc/UpdateGroupChatModal'

const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const {selectedChat,setSelectedChat,user}=useContext(AppContext)



  return (
    <>
    {
      selectedChat ? (
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
            {
              !selectedChat.isGroupChat ? (
                <>
                {getSender(user,selectedChat.users)}
                <ProfileModal user={getWholeSender(user,selectedChat.users)}/>
                </>
              ) : (
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )
            }
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
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Open sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )

    }
    </>
  )
}

export default SingleChat