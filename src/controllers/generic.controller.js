import { ping } from '../services/generic.service.js';

export async function wake(_, res) {
    await ping();
    res.send("done");
}
