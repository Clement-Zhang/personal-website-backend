import { reformat, match } from '../controllers/socket.controller.js';

export default (socket) => {
    socket.on('reformat', async (data) =>
        data.type === 'req' ? reformat(data.prompt, socket) : null
    );
    socket.on('match', async (data, callback) => match(data, callback));
};
