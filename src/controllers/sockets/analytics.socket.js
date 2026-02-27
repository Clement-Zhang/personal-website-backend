import { getAllUsers, getAnalytics } from '../../services/analytics.service.js';

export async function update(socket) {
    socket.emit('update', {
        users: await getAllUsers(),
        analytics: await getAnalytics(),
    });
}
