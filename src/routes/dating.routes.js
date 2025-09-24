const express = require('express');
const ama = express.Router();
const userController = require('../controllers/dating.controller');
ama.post('/deepseek', userController.reformatPrompt);
ama.post('/match', userController.getMatches);
ama.post('/reset', userController.reset);

module.exports = ama;
