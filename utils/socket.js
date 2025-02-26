import { io } from "socket.io-client";
const socket = io("https://interngo.onrender.com",{autoConnect:false});
export default socket;