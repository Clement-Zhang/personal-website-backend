import {
    loadTestUsers,
    deleteUsers,
} from '../services/dating.service.js';

export async function reset(_, res) {
    await deleteUsers();
    await loadTestUsers();
    res.end();
}
