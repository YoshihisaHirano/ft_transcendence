import ioClient from 'socket.io-client';

const chatSocket = ioClient(`http://${import.meta.env.VITE_HOST_IP}:3000/chat`, { transports: ['websocket']});
export const chatIo = chatSocket;