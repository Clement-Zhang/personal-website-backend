import { load } from '../../controllers/sockets/analytics.socket.js';
import { changes } from '../../configs/mongo.config.js';

export default (socket) => {
    changes.on('change', async () => load(socket));
};
