import ioClient from 'socket.io-client';

const gameSocket = ioClient('http://10.18.120.249:3000/game', { transports: ['websocket']});
export const gameIo = gameSocket;
