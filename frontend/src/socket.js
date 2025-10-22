import {io} from 'socket.io-client';
let socket;

export const getSocket = () => {
    if(!socket) {
        socket = io(import.meta.env.VITE_BA_URL);
    }
    return socket;
}
export const setSocket = () => {
    socket = null;
}