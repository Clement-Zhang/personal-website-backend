import { wake } from '../controllers/generic.controller.js';
import { Router } from 'express';

const generic = Router();

generic.get('/wake', wake);

export default generic;
