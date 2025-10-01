import {
    reformatProfile,
    summarizeProfile,
    loadTestUsers,
    getMatches,
    deleteUsers,
} from '../services/dating.service.js';
import { ping } from '../services/generic.service.js';

export const reformat = async (prompt) => await reformatProfile(prompt);

export const match = async (profile) =>
    await getMatches(await summarizeProfile(profile));

export async function reset(_, res) {
    await deleteUsers();
    await loadTestUsers();
    res.end();
}

export async function wake(_, res) {
    await ping();
    res.end();
}
