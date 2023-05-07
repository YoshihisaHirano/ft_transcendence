import ioClient from 'socket.io-client';

const statusSocket = ioClient('http://192.168.10.3:3000/status');
export const statusIo = statusSocket;
