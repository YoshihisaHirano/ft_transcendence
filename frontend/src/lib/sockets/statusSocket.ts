import ioClient from 'socket.io-client';

const statusSocket = ioClient('http://localhost:3000/status');
export const statusIo = statusSocket;
