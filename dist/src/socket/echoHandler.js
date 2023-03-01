"use strict";
module.exports = (io, socket) => {
    const echoHandler = (payload) => {
        socket.emit('echo:echo_res', payload);
    };
    socket.on("echo:echo", echoHandler);
};
//# sourceMappingURL=echoHandler.js.map