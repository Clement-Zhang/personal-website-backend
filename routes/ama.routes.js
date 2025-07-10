const express = require('express');
const ama = express.ama();
const userController = require('../controllers/ama.controller');
ama.post('/deepseek', userController.reformatPrompt);
ama.post('/match', userController.getMatches);
ama.post('/reset', userController.reset);

module.exports = ama;