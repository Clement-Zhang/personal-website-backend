import OpenAI from 'openai';
import 'dotenv/config';

export default new OpenAI({
    baseURL:
        process.env.ACTIVE_API === 'openrouter'
            ? 'https://openrouter.ai/api/v1'
            : 'https://router.huggingface.co/v1',
    apiKey: process.env.OPENAI_KEY,
});
