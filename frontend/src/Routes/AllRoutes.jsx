import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ChatPage from '../Pages/ChatPage'
import Homepage from '../Pages/Homepage'

const AllRoutes = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Homepage/>}></Route>
        <Route path="/chats" element={<ChatPage/>}></Route>
    </Routes>
    </>
  )
}

export default AllRoutes