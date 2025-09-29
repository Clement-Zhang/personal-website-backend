import { MongoClient, ServerApiVersion } from 'mongodb';
const uri =
    'mongodb+srv://zhangclement947:8imzvIYFQmuPHTXS@website.6gtbmdg.mongodb.net/?retryWrites=true&w=majority&appName=website';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        const collection = client.db('dating').collection('users');
        await collection.createSearchIndex({
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
        return collection;
    } catch (err) {
        console.log(err);
        await client.close();
    }
}
export const collection = await run().catch(console.dir);
