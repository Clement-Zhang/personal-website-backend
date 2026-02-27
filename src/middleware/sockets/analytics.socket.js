import { update } from '../../controllers/sockets/analytics.socket.js';
import { changes } from '../../configs/mongo.config.js';

export default (socket) => {
    console.log('socket attached');
    changes.on('change', async () => {
        console.log('Change detected, emitting update');
        await update(socket);
        console.log('Update emitted');
    });
};
