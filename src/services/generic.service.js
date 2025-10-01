import { collection } from '../configs/mongo.config.js';

export async function ping() {
    await collection.findOne();
}
