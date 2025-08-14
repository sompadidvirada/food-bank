import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useFoodBankStorage from "../src/zustand/foodbank-storage";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);
const envUrl = import.meta.env.VITE_API_URL;

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const token = useFoodBankStorage((state)=>state.token)

  // Initialize socket once
  if (!socketRef.current) {
    socketRef.current = io(envUrl, {
      auth: {
        token,
      },
    });
  }

  useEffect(() => {
    // Disconnect only when app is really unmounting
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
