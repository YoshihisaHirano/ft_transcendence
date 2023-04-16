import ioClient from 'socket.io-client';

const gameSocket = ioClient('http://localhost:3000/game');
export const gameIo = gameSocket;
