import ioClient from 'socket.io-client';

const chatSocket = ioClient('http://192.168.10.11:3000/chat');
export const chatIo = chatSocket;