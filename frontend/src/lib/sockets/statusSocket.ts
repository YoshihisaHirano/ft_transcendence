import ioClient from 'socket.io-client';

const statusSocket = ioClient('http://localhost:3000/status', { transports: ['websocket']});
export const statusIo = statusSocket;
