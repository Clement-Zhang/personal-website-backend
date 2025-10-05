import OpenAI from 'openai';
import 'dotenv/config';

export default new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_KEY,
});
