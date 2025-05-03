
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '@/utils/utils';

interface UseWebSocketOptions {
  url: string;
  protocols?: string | string[];
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  autoReconnect?: boolean;
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onMessage?: (event: WebSocketEventMap['message']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
}

export const useWebSocket = ({
  url,
  protocols,
  reconnectDelay = 3000,
  maxReconnectAttempts = 5,
  autoReconnect = true,
  onOpen,
  onMessage,
  onError,
  onClose
}: UseWebSocketOptions) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  const reconnectTimeoutRef = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  
  // Efektywne wysyłanie wiadomości
  const debouncedSend = useCallback(
    debounce((data: string) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(data);
      }
    }, 50), 
    []
  );

  // Funkcja do tworzenia połączenia WebSocket
  const connect = useCallback(() => {
    try {
      const newSocket = new WebSocket(url, protocols);
      
      newSocket.onopen = (event) => {
        setIsConnected(true);
        setReconnectAttempts(0);
        onOpen?.(event);
        console.log('WebSocket połączony:', url);
      };
      
      newSocket.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setLastMessage(parsedData);
          onMessage?.(event);
        } catch (error) {
          // Jeśli dane nie są w formacie JSON, zachowaj je jako zwykły tekst
          setLastMessage(event.data);
          onMessage?.(event);
        }
      };
      
      newSocket.onerror = (event) => {
        console.error('Błąd WebSocket:', event);
        onError?.(event);
      };
      
      newSocket.onclose = (event) => {
        setIsConnected(false);
        onClose?.(event);
        console.log('WebSocket rozłączony z kodem:', event.code);
        
        if (autoReconnect && reconnectAttempts < maxReconnectAttempts) {
          const timeout = window.setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, reconnectDelay);
          
          reconnectTimeoutRef.current = timeout;
        }
      };
      
      setSocket(newSocket);
      socketRef.current = newSocket;
      
    } catch (error) {
      console.error('Błąd podczas tworzenia połączenia WebSocket:', error);
    }
  }, [
    url, 
    protocols, 
    reconnectAttempts, 
    maxReconnectAttempts, 
    autoReconnect, 
    reconnectDelay, 
    onOpen, 
    onMessage, 
    onError, 
    onClose
  ]);

  // Inicjalizacja połączenia
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  // Funkcja do ręcznego wysyłania wiadomości
  const sendMessage = useCallback(
    (data: string | object) => {
      if (typeof data === 'object') {
        debouncedSend(JSON.stringify(data));
      } else {
        debouncedSend(data);
      }
    },
    [debouncedSend]
  );

  // Funkcja do zamykania połączenia
  const disconnect = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  }, [socket]);

  // Funkcja do ręcznego ponownego łączenia
  const reconnect = useCallback(() => {
    if (socket) {
      socket.close();
    }
    setReconnectAttempts(0);
    connect();
  }, [socket, connect]);

  return {
    socket,
    isConnected,
    reconnectAttempts,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect
  };
};
