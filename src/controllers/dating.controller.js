import {
    reformatProfile,
    summarizeProfile,
    loadTestUsers,
    getMatches,
    deleteUsers,
} from '../services/dating.service.js';

export async function reformat(req, res) {
    console.log(await reformatProfile(req.body));
    res.send(await reformatProfile(req.body));
}

export async function match(req, res) {
    res.send(await getMatches(await summarizeProfile(req.body)));
}

export async function reset(_, res) {
    await deleteUsers();
    await loadTestUsers();
    res.end();
}
