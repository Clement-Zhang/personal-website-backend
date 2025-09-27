import { InferenceClient } from '@huggingface/inference';
import 'dotenv/config';
export default new InferenceClient(process.env.HUGGINGFACE_KEY);
