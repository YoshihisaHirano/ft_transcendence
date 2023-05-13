import ioClient from 'socket.io-client';

const gameSocket = ioClient('http://172.20.0.10:3000/game');
export const gameIo = gameSocket;
