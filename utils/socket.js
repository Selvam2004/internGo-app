import { io } from "socket.io-client";
const socket = io("https://interngo.in/api", { autoConnect: false });
export default socket;