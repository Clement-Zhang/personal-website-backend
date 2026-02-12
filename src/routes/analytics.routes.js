import { Router } from 'express';
import {
    addUser,
    getData,
    getUsers,
    summarize,
    editUser,
    deleteUser,
    wipe,
} from '../controllers/analytics.controller.js';

const analytics = Router();

analytics.post('/add', addUser);
analytics.get('/data', getData);
analytics.get('/get', getUsers);
analytics.get('/summarize', summarize);
analytics.post('/edit', editUser);
analytics.post('/delete', deleteUser);
analytics.post('/wipe', wipe);

export default analytics;
