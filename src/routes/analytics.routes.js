import { Router } from 'express';
import {
    addUser,
    getData,
    editUser,
    deleteUser,
    wipe,
} from '../controllers/analytics.controller.js';

const analytics = Router();

analytics.post('/add', addUser);
analytics.get('/data', getData);
analytics.post('/edit', editUser);
analytics.post('/delete', deleteUser);
analytics.post('/wipe', wipe);

export default analytics;
