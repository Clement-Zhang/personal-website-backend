const db = require('../configs/sqlite.config');
const api = require('../configs/huggingface.config');
const amaService = require('../services/ama.service');
const data = require('../datasets/ama');

let getMatches;

exports.reformatPrompt = async (req, res) => {
    const result = await api.chatCompletion({
        provider: 'auto',
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [
            {
                role: 'system',
                content:
                    "you are being used in a dating application. your job is to reformat the prompt in this format, if possible: my name is {user's name}, and I am a {user's gender} looking to meet a {prospective match's gender}. I enjoy {user's likes}, and I'm not a fan of {user's dislikes}. If the user's likes and dislikes are not mentioned, remove all references to them. If only the user's likes and dislikes are mentioned, remove all references to name and gender. If the user's name isn't mentioned, respond \"i am a {user's gender} etc\". If the prospective match's gender is not stated but the user's gender is, or if the prospective match's gender is stated but the user's gender is not, assume the missing gender is the opposite of the stated gender. If both are missing, respond with \"fail\" only.",
            },
            {
                role: 'user',
                content: "i like gaming. i don't like drugs. give me a match.",
            },
        ],
    });
    res.json({ response: result.choices[0].message.content });
};

exports.getMatches = async (req, res) => {
    const embedding = await api.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: req.body.profile,
        provider: 'auto',
    });
    const embeddingBuffer = Buffer.from(new Float32Array(embedding).buffer);
    let matches = getMatches.all(embeddingBuffer);
    const getLikes = db.prepare(
        'SELECT item FROM likes JOIN items ON items.id = likes.item_id WHERE likes.user_id = ?'
    );
    const getDislikes = db.prepare(
        'SELECT item FROM dislikes JOIN items ON items.id = dislikes.item_id WHERE dislikes.user_id = ?'
    );
    matches = matches.map((user) => {
        const likes = getLikes.all(user.id).map((row) => row.item);
        const dislikes = getDislikes.all(user.id).map((row) => row.item);
        return {
            ...user,
            likes: likes,
            dislikes: dislikes,
        };
    });
    res.json({ matches: matches });
};

exports.reset = async (req, res) => {
    db.exec('DROP TABLE IF EXISTS "users";');
    db.exec('DROP TABLE IF EXISTS "items";');
    db.exec('DROP TABLE IF EXISTS "likes";');
    db.exec('DROP TABLE IF EXISTS "dislikes";');
    db.exec('DROP TABLE IF EXISTS "embeddings";');
    db.exec(
        'CREATE TABLE IF NOT EXISTS "users" ("id" INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT, "gender" TEXT NOT NULL, "name" TEXT NOT NULL,"want" TEXT NOT NULL);'
    );
    db.exec(
        'CREATE TABLE IF NOT EXISTS "items" ("id" INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT, "item" TEXT NOT NULL UNIQUE);'
    );
    db.exec(
        'CREATE TABLE IF NOT EXISTS "likes" ("user_id" INTEGER NOT NULL,	"item_id"	INTEGER NOT NULL, PRIMARY KEY("user_id","item_id"));'
    );
    db.exec(
        'CREATE TABLE IF NOT EXISTS "dislikes" ("user_id" INTEGER NOT NULL,	"item_id"	INTEGER NOT NULL, PRIMARY KEY("user_id","item_id"));'
    );
    db.exec(
        'CREATE VIRTUAL TABLE IF NOT EXISTS "embeddings" USING vectorlite(embedding float32[384] cosine, hnsw(max_elements=100), "embeddings.index");'
    );
    getMatches = db.prepare(
        'SELECT id, name, gender, want FROM embeddings JOIN users ON users.id = embeddings.rowid WHERE knn_search(embedding, knn_param(?, 5))'
    );
    await amaService.loadDummyData(data);
    res.json({ status: 'ok' });
};
