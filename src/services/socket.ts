import { io, Socket } from "socket.io-client";

class SocketSingleton {
  private static instance: Socket | null = null;
  private static currentToken: string | null = null;

  private constructor() {}

  public static getInstance(token: string): Socket {
    const uri = import.meta.env.VITE_REQUEST_URL;

    if (!SocketSingleton.instance || token !== SocketSingleton.currentToken) {
      if (SocketSingleton.instance) {
        SocketSingleton.instance.disconnect();
        SocketSingleton.instance.removeAllListeners();
      }

      SocketSingleton.currentToken = token;
      SocketSingleton.instance = io(uri, {
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        forceNew: true,
        auth: {
          token: `Bearer ${token}`,
        },
      });

      SocketSingleton.instance.on("connect", () => {
        console.log("Socket connected:", SocketSingleton.instance?.id);
      });

      SocketSingleton.instance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }

    return SocketSingleton.instance;
  }

  public static destroyInstance(): void {
    if (SocketSingleton.instance) {
      SocketSingleton.instance.disconnect();
      SocketSingleton.instance.removeAllListeners();
      SocketSingleton.instance = null;
      SocketSingleton.currentToken = null;
    }
  }
}

export default SocketSingleton;
