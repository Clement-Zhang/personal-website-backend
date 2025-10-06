import { reformat, match } from '../controllers/socket.controller.js';

export default (socket) => {
    socket.on('reformat', async (data) => {
        const stream = await reformat(data);
        socket.emit('start reformat');
        for await (const chunk of stream) {
            socket.emit('reformatting', chunk.choices[0].delta.content);
        }
    });

    socket.on('match', async (data, callback) => {
        callback(await match(data));
    });
};
