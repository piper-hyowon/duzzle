import { io, Socket } from "socket.io-client";

class SocketSingleton {
  private static instance: Socket | null = null;

  private constructor() {}

  public static getInstance(token: string): Socket {
    const uri = import.meta.env.VITE_REQUEST_URL;
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = io(uri, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 50,
        reconnectionAttempts: 5,
        forceNew: false,
        auth: {
          token: `Bearer ${token}`,
        },
      });
    }
    return SocketSingleton.instance;
  }

  public static destroyInstance(): void {
    if (SocketSingleton.instance) {
      SocketSingleton.instance.disconnect();
      SocketSingleton.instance = null;
    }
  }
}

export default SocketSingleton;
