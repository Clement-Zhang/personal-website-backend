const { InferenceClient } = require('@huggingface/inference');
require('dotenv').config();
const api = new InferenceClient(process.env.HUGGINGFACE_KEY);

module.exports = api;
