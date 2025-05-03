
import { useEffect, useRef, useState, useCallback } from 'react';

type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'error';

interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  autoConnect?: boolean;
  protocols?: string | string[];
}

/**
 * Hook do obsługi WebSocket z funkcjonalnością ponownego połączenia
 */
export function useWebSocket(
  url: string,
  options: UseWebSocketOptions = {}
) {
  const {
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    autoConnect = true,
    protocols
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Funkcja do tworzenia nowego połączenia WebSocket
  const connect = useCallback(() => {
    // Najpierw zamknij istniejące połączenie jeśli istnieje
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    try {
      setStatus('connecting');
      wsRef.current = new WebSocket(url, protocols);
      
      wsRef.current.onopen = (event) => {
        setStatus('open');
        attemptsRef.current = 0; // Reset licznika prób po udanym połączeniu
        onOpen?.(event);
      };
      
      wsRef.current.onmessage = (event) => {
        setLastMessage(event);
        onMessage?.(event);
      };
      
      wsRef.current.onerror = (event) => {
        setStatus('error');
        onError?.(event);
      };
      
      wsRef.current.onclose = (event) => {
        setStatus('closed');
        onClose?.(event);
        
        // Próba ponownego połączenia jeśli nie zamknęliśmy połączenia świadomie
        if (!event.wasClean && attemptsRef.current < reconnectAttempts) {
          attemptsRef.current += 1;
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      setStatus('error');
      console.error('WebSocket connection error:', error);
      
      // Próba ponownego połączenia po błędzie
      if (attemptsRef.current < reconnectAttempts) {
        attemptsRef.current += 1;
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    }
  }, [url, protocols, reconnectAttempts, reconnectInterval, onOpen, onMessage, onError, onClose]);
  
  // Funkcja do wysyłania wiadomości przez WebSocket
  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
      return true;
    }
    return false;
  }, []);
  
  // Funkcja do zamykania połączenia
  const disconnect = useCallback((code?: number, reason?: string) => {
    if (wsRef.current) {
      setStatus('closing');
      wsRef.current.close(code, reason);
    }
    
    // Wyczyść timeout ponownego połączenia, jeśli istnieje
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Resetuj licznik prób
    attemptsRef.current = 0;
  }, []);
  
  // Funkcja do wysyłania wiadomości JSON
  const sendJson = useCallback((data: any) => {
    try {
      const jsonString = JSON.stringify(data);
      return send(jsonString);
    } catch (error) {
      console.error('Error stringifying JSON data:', error);
      return false;
    }
  }, [send]);
  
  // Nawiązywanie połączenia przy montowaniu komponentu
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    // Czyszczenie przy odmontowaniu komponentu
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [autoConnect, connect]);
  
  return {
    status,
    lastMessage,
    send,
    sendJson,
    connect,
    disconnect
  };
}
