import { Socket, Server } from 'socket.io';

let appSocket = {
  emit: (channel: string, message: string) => {
    console.log('Not initiated yet', channel, message);
  },
};

let listeners: any[] = [];
let recentMessages: any[] = [];

export default defineEventHandler((event) => {
  event.context.appSocket = appSocket;

  if (global.io) return;

  const node = event.node;
  global.io = new Server(node.res.socket?.server);
  global.io.on('connection', (socket: Socket) => {
    listeners.push({ channel: 'offer', socket });
    for (const recentMessage of recentMessages) {
      socket.emit('offer', recentMessage);
    }

    appSocket.emit = (channel, message) => {
      console.log('Emitting', channel, message);
      global.io.emit(channel, message);

      recentMessages.push(message);
      if (recentMessages.length > 3) {
        recentMessages.splice(0, 1);
      }
    };

    socket.on('disconnect', () => {
      // Put optional disconnect logic here
    });
  });
});
