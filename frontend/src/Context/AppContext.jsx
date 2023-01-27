import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { createContext } = require("react");


export const AppContext=createContext()


export default function AppContextProvider({children}){
    const [user,setUser]=useState()
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    const [notification, setNotification] = useState([])
    const navigate=useNavigate()


    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo)

        if(!userInfo) navigate("/")
    },[navigate])
    return <AppContext.Provider value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
        notification,
        setNotification
      }}>
        {children}
    </AppContext.Provider>
}