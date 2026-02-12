import {
    addOneUser,
    getAllUsers,
    updateUser,
    getAnalytics,
    deleteOneUser,
    deleteUsers,
} from '../services/analytics.service.js';

export async function addUser(req, res) {
    await addOneUser(req.body);
    res.end();
}

export const getData = async (_, res) =>
    res.json({
        users: await getAllUsers(),
        analytics: await getAnalytics(),
    });

export const summarize = async (_, res) => res.json(await getAnalytics());

export const getUsers = async (_, res) => res.json(await getAllUsers());

export async function editUser(req, res) {
    await updateUser(req.body);
    res.end();
}

export async function deleteUser(req, res) {
    await deleteOneUser(req.body);
    res.end();
}

export async function wipe(_, res) {
    await deleteUsers();
    res.end();
}
