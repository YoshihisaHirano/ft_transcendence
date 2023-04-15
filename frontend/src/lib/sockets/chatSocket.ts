import ioClient from 'socket.io-client';

const chatSocket = ioClient('http://localhost:3000/chat');
export const chatIo = chatSocket;