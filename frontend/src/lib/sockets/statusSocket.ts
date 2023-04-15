import ioClient from 'socket.io-client';

const statusSocket = ioClient('http://192.168.10.1:3000/status');
export const statusIo = statusSocket;
