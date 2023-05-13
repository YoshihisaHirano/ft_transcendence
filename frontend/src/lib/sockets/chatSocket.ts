import ioClient from 'socket.io-client';

const chatSocket = ioClient('http://localhost:3000/chat', { transports: ['websocket']});
export const chatIo = chatSocket;