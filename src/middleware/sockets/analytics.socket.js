import { update } from '../../controllers/sockets/analytics.socket.js';
import { changes } from '../../configs/mongo.config.js';

export default (socket) => {
    changes.on('change', async () => {
        await update(socket);
    });
};
