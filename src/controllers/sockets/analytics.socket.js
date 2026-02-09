import { getAllUsers, getAnalytics } from '../../services/analytics.service';

export async function load(socket) {
    socket.emit('load', {
        users: await getAllUsers(),
        analytics: await getAnalytics(),
    });
}
