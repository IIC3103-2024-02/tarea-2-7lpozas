import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setFlights, updatePlane, addMessage, addTakeOff, addLanding, addCrash } from '../store/flightsSlice';

const WebSocketContext = createContext(null);

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const dispatch = useDispatch();

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('wss://tarea-2.2024-2.tallerdeintegracion.cl/connect');

    ws.onopen = () => {
      console.log('WebSocket conectado');
      setRetryCount(0);
      const joinEvent = {
        type: 'join',
        id: '16201116',
        username: 'Crimzon69',
      };
      ws.send(JSON.stringify(joinEvent));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido:', data);

      switch (data.type) {
        case 'flights':
          dispatch(setFlights(data.flights));
          break;
        case 'plane':
          dispatch(updatePlane(data.plane));
          break;
        case 'take-off':
          dispatch(addTakeOff(data.flight_id));
          break;
        case 'landing':
          dispatch(addLanding(data.flight_id));
          break;
        case 'crashed':
          dispatch(addCrash(data.flight_id));
          break;
        case 'message':
          dispatch(addMessage(data.message));
          break;
        default:
          console.log('Evento desconocido:', data.type);
      }
    };

    ws.onerror = (error) => {
      console.error('Error de WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      if (retryCount < 5) {
        const nextRetryCount = retryCount + 1;
        console.log(`Intento de reconexión ${nextRetryCount} de 5...`);
        setRetryCount(nextRetryCount);
        setTimeout(() => connectWebSocket(), 10000);
      } else {
        console.log('Se alcanzó el número máximo de intentos de reconexión');
      }
    };

    setSocket(ws);
  }, [dispatch, retryCount]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error('WebSocket no está abierto');
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}