import { reset } from '../controllers/dating.controller.js';
import { Router } from 'express';

const dating = Router();

dating.post('/reset', reset);

export default dating;
