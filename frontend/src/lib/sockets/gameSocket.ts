import ioClient from 'socket.io-client';

const gameSocket = ioClient('http://192.168.10.11:3000/game');
export const gameIo = gameSocket;
