import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import AppContextProvider from "./Context/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AppContextProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
