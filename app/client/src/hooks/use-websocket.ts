import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  lastMessage: MessageEvent | null;
  sendJsonMessage: (data: any) => void;
  reconnect: () => void;
}

export function useWebSocket(): WebSocketState {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create WebSocket connection
  const connect = useCallback(() => {    
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectTimeoutRef.current === null) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, 5000);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onmessage = (message) => {
        setLastMessage(message);
      };
      
      setSocket(ws);
      
      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, []);
  
  // Send JSON message
  const sendJsonMessage = useCallback((data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
    }
  }, [socket, isConnected]);
  
  // Reconnect function
  const reconnect = useCallback(() => {
    if (socket) {
      socket.close();
    }
    connect();
  }, [socket, connect]);
  
  // Connect on mount and when online status changes
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);
  
  return {
    socket,
    isConnected,
    lastMessage,
    sendJsonMessage,
    reconnect
  };
}
