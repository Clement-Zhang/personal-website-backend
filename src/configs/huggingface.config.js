const { InferenceClient } = require('@huggingface/inference');
const dotenv = require('dotenv');
dotenv.config();
const api = new InferenceClient(process.env.HUGGINGFACE_KEY);

module.exports = api;
