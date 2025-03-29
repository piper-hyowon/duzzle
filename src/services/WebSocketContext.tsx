import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import SocketSingleton from "./socket";

interface WebSocketContextType {
  socket: Socket;
  token: string;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
  token: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  token,
}) => {
  const socket = useMemo(() => SocketSingleton.getInstance(token), [token]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!socket.connected) {
      console.log("웹소켓 연결 시도...");
      socket.connect();
    }

    function onConnect() {
      console.log("웹소켓 연결 성공:", socket.id);
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("웹소켓 연결 해제");
      setIsConnected(false);
    }

    function onError(error: Error) {
      console.error("웹소켓 에러:", error);
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("error", onError);
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, token, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
