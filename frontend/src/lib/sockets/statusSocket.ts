import ioClient from 'socket.io-client';

const statusSocket = ioClient('http://10.18.120.249:3000/status', { transports: ['websocket']});
export const statusIo = statusSocket;
