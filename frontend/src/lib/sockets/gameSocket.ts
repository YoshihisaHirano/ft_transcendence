import ioClient from 'socket.io-client';

const gameSocket = ioClient(`http://${import.meta.env.VITE_HOST_IP}:3000/game`, { transports: ['websocket']});
export const gameIo = gameSocket;
