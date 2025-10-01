import { reset } from '../controllers/dating.controller.js';
import { Router } from 'express';

const dating = Router();

dating.post('/reset', reset);
dating.get('/wake', (_, res) => {
    res.end();
});

export default dating;
