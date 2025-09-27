import {
    reformat,
    match,
    reset,
} from '../controllers/dating.controller.js';
import { Router } from 'express';
const dating = Router();

dating.post('/reformat', reformat);
dating.post('/match', match);
dating.post('/reset', reset);

export default dating;
