import ioClient from 'socket.io-client';

const statusSocket = ioClient('http://172.20.0.10:3000/status');
export const statusIo = statusSocket;
