import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
    socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    const echoHandler = (payload) => {
        socket.emit('echo:echo_res', payload)
    }

    socket.on("echo:echo", echoHandler);
    }