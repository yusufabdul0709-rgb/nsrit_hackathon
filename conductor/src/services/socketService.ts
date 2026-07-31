import { SERVER_HOST } from './apiClient';

let io: any = null;
try {
  io = require('socket.io-client').io || require('socket.io-client');
} catch (e) {
  console.warn('socket.io-client module loading...');
}

const SOCKET_URL = `http://${SERVER_HOST}:5000`;

class SocketService {
  private socket: any = null;
  private listeners: { [event: string]: Function[] } = {};

  connect() {
    if (this.socket) return this.socket;

    if (io) {
      try {
        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
        });

        this.socket.on('connect', () => {
          console.log('⚡ Conductor App Connected to Socket.IO Server:', this.socket?.id);
        });
      } catch (err) {
        console.warn('Socket connection fallback active');
      }
    }
    return this.socket;
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const conductorSocket = new SocketService();
