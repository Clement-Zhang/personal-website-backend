import { reformat, match } from '../controllers/dating.controller.js';

export default (socket) => {
    socket.on('reformat', async (data, callback) => {
        callback(await reformat(data));
    });

    socket.on('match', async (data, callback) => {
        callback(await match(data));
    });
};
