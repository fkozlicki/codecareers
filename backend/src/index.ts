import { createServer } from 'node:http';
import { Server } from 'socket.io';
import app from './app';
import { keepAlive } from './utils/keepAlive';

const port = process.env.PORT || 3000;
const server = createServer(app);

export const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URI,
	},
});

io.on('connection', (socket) => {
	console.log(`User Connected: ${socket.id}`);

	socket.on('join_room', (data) => {
		socket.join(data);
	});
});

server.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

keepAlive();
