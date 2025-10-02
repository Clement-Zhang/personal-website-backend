import { collection } from '../configs/mongo.config.js';
import { summarizeProfile } from './dating.service.js';

export async function ping() {
    await collection.findOne();
    await summarizeProfile('');
}
