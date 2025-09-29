import datingRoutes from './routes/dating.routes.js';
import datingSocket from './middleware/socket.middleware.js';
import corsOptions from './middleware/cors.middleware.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import express from 'express';
import 'dotenv/config';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors(corsOptions));
app.use(express.text());
app.use('/dating/api', datingRoutes);
io.on('connection', datingSocket);

server.listen(process.env.PORT, () => {});
