import ioClient from 'socket.io-client';

const chatSocket = ioClient('http://172.20.0.10:3000/chat');
export const chatIo = chatSocket;