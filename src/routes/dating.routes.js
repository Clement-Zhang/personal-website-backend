import { reset } from '../controllers/dating.controller.js';
import { wake } from '../controllers/generic.controller.js';
import { Router } from 'express';

const dating = Router();

dating.post('/reset', reset);
dating.get('/wake', wake);

export default dating;
