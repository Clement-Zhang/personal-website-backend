import { load } from '../../controllers/sockets/analytics.socket';
import { changes } from '../../configs/mongo.config';

export default (socket) => {
    changes.on('change', async () => load(socket));
};
