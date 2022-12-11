import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export = (io:Server, socket:any) => {
    const echoHandler = (payload) => {
        socket.emit('echo:echo', payload)
    }

    const readHandler = (payload) => {
        // ...
    }

    socket.on("echo:echo", echoHandler);
    socket.on("echo:read", readHandler);
    }