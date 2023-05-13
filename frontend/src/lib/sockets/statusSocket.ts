import ioClient from 'socket.io-client';

const statusSocket = ioClient(`http://${import.meta.env.VITE_HOST_IP}:3000/status`, { transports: ['websocket']});
export const statusIo = statusSocket;
