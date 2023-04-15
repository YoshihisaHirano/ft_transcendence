import ioClient from 'socket.io-client';
const ENDPOINT = import.meta.env.VITE_BACKEND_URL;

const chatSocket = ioClient('http://localhost:3000/chat');

export const chatIo = chatSocket;