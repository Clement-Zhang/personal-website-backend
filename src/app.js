import datingRoutes from './routes/dating.routes.js';
import datingSocket from './middleware/socket.middleware.js';
import analyticsRoutes from './routes/analytics.routes.js';
import genericRoutes from './routes/generic.routes.js';
import corsOptions from './middleware/cors.middleware.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import express from 'express';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.text());
app.use('/dating/api', datingRoutes);
app.use('/analytics/api', analyticsRoutes);
app.use('/generic', genericRoutes);
io.on('connection', datingSocket);

server.listen(3001, () => {});
