import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext"; 

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { userInfo, loading: authLoading } = useAuth(); 
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (authLoading) {
      console.log(
        "SocketContext: Auth loading, skipping socket connection for now."
      );
      return;
    }

    if (!userInfo) {
      if (socket) {
        console.log(
          "SocketContext: No userInfo, disconnecting existing socket."
        );
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    if (socket && socket.connected) {
      // console.log("SocketContext: Socket already connected, skipping new connection.");
      return;
    }

    const SOCKET_SERVER_URL = "http://localhost:5000";

    console.log("SocketContext: Attempting to connect socket...");
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: {
        token: userInfo.token, 
      },
      transports: ["websocket", "polling"], // Preferir websockets
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("SocketContext: Socket connected! ID:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("SocketContext: Socket disconnected! Reason:", reason);
    });

    newSocket.on("connect_error", (error) => {
      console.error("SocketContext: Socket connection error:", error.message);
      setIsConnected(false); 
    });

    newSocket.on("connected", (data) => {
      console.log(
        "SocketContext: Server acknowledged connection:",
        data.message
      );
    });

    newSocket.on("chatError", (errorMessage) => {
      console.error("SocketContext: Chat error from server:", errorMessage);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        console.log("SocketContext: Disconnecting socket on cleanup.");
        newSocket.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, authLoading]); 

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
