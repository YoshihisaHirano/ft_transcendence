import ioClient from 'socket.io-client';

const chatSocket = ioClient('http://10.18.120.249:3000/chat', { transports: ['websocket']});
export const chatIo = chatSocket;