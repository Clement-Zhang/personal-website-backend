import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        const dating = client.db('dating').collection('users');
        const analytics = client.db('analytics').collection('users');
        const changes = analytics.watch();
        console.log(changes.closed);
        await dating.createSearchIndex({
            name: 'summary',
            type: 'vectorSearch',
            definition: {
                fields: [
                    {
                        type: 'vector',
                        numDimensions: 384,
                        path: 'summary',
                        similarity: 'cosine',
                    },
                ],
            },
        });
        return { dating, analytics, changes };
    } catch (err) {
        console.log(err);
        await client.close();
    }
}

export const { dating, analytics, changes } = await run().catch(console.dir);
