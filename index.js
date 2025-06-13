const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("better-sqlite3")("ama.sqlite", { verbose: console.log });
const vectorlite = require("vectorlite");
const { InferenceClient } = require("@huggingface/inference");

db.loadExtension(vectorlite.vectorlitePath());
let getMatches;
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const api = new InferenceClient(process.env.HUGGINGFACE_KEY);

app.post("/deepseek", async (req, res) => {
    const result = await api.chatCompletion({
        provider: "auto",
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
            {
                role: "system",
                content: "you are being used in a dating application. your job is to reformat the prompt in this format, if possible: my name is {user's name}, and I am a {user's gender} looking to meet a {prospective match's gender}. I enjoy {user's likes}, and I'm not a fan of {user's dislikes}. If the user's likes and dislikes are not mentioned, remove all references to them. If only the user's likes and dislikes are mentioned, remove all references to name and gender. If the user's name isn't mentioned, respond \"i am a {user's gender} etc\". If the prospective match's gender is not stated but the user's gender is, or if the prospective match's gender is stated but the user's gender is not, assume the missing gender is the opposite of the stated gender. If both are missing, respond with \"fail\" only."
            },
            {
                role: "user",
                content: "i like gaming. i don't like drugs. give me a match."
            }],
    });
    res.json({ response: result.choices[0].message.content });
});

app.post("/match", async (req, res) => {
    console.log(req.body.profile);
    const embedding = await api.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: req.body.profile,
        provider: "auto",
    });
    const embeddingBuffer = Buffer.from(new Float32Array(embedding).buffer);
    let matches = getMatches.all(embeddingBuffer);
    const getLikes = db.prepare("SELECT item FROM likes JOIN items ON items.id = likes.item_id WHERE likes.user_id = ?");
    const getDislikes = db.prepare("SELECT item FROM dislikes JOIN items ON items.id = dislikes.item_id WHERE dislikes.user_id = ?");
    matches = matches.map(user => {
        const likes = getLikes.all(user.id).map(row => row.item);
        const dislikes = getDislikes.all(user.id).map(row => row.item);
        return {
            ...user,
            likes: likes,
            dislikes: dislikes
        };
    });
    res.json({ matches: matches });
});

app.post("/reset", async (req, res) => {
    db.exec("DROP TABLE IF EXISTS \"users\";");
    db.exec("DROP TABLE IF EXISTS \"items\";");
    db.exec("DROP TABLE IF EXISTS \"likes\";");
    db.exec("DROP TABLE IF EXISTS \"dislikes\";");
    db.exec("DROP TABLE IF EXISTS \"embeddings\";");
    db.exec("CREATE TABLE IF NOT EXISTS \"users\" (\"id\" INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT, \"gender\" TEXT NOT NULL, \"name\" TEXT NOT NULL,\"want\" TEXT NOT NULL);")
    db.exec("CREATE TABLE IF NOT EXISTS \"items\" (\"id\" INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT, \"item\" TEXT NOT NULL UNIQUE);")
    db.exec("CREATE TABLE IF NOT EXISTS \"likes\" (\"user_id\" INTEGER NOT NULL,	\"item_id\"	INTEGER NOT NULL, PRIMARY KEY(\"user_id\",\"item_id\"));")
    db.exec("CREATE TABLE IF NOT EXISTS \"dislikes\" (\"user_id\" INTEGER NOT NULL,	\"item_id\"	INTEGER NOT NULL, PRIMARY KEY(\"user_id\",\"item_id\"));")
    db.exec("CREATE VIRTUAL TABLE IF NOT EXISTS \"embeddings\" USING vectorlite(embedding float32[384] cosine, hnsw(max_elements=100), \"embeddings.index\");");
    getMatches = db.prepare("SELECT id, name, gender, want FROM embeddings JOIN users ON users.id = embeddings.rowid WHERE knn_search(embedding, knn_param(?, 5))");
    await loadDummyData();
    res.json({ status: "ok" });
})

async function loadDummyData() {
    const amaDummyData = [
        {
            "name": "mia",
            "gender": "female",
            "want": "male",
            "likes": [
                "hiking",
                "coffee",
                "indie music",
                "dogs"
            ],
            "dislikes": [
                "smoking",
                "loud crowds",
                "dishonesty"
            ]
        },
        {
            "name": "alex",
            "gender": "male",
            "want": "male",
            "likes": [
                "cooking",
                "sci-fi movies",
                "board games",
                "cats"
            ],
            "dislikes": [
                "spicy food",
                "early mornings",
                "traffic jams"
            ]
        },
        {
            "name": "sophie",
            "gender": "female",
            "want": "male",
            "likes": [
                "traveling",
                "beach days",
                "reading thrillers",
                "jazz music"
            ],
            "dislikes": [
                "cold weather",
                "caffeine",
                "procrastination"
            ]
        },
        {
            "name": "ethan",
            "gender": "male",
            "want": "female",
            "likes": [
                "football",
                "craft beer",
                "video games",
                "comedy shows"
            ],
            "dislikes": [
                "mushrooms",
                "rain",
                "slow internet"
            ]
        },
        {
            "name": "chloe",
            "gender": "female",
            "want": "female",
            "likes": [
                "gardening",
                "painting",
                "classic movies",
                "sushi"
            ],
            "dislikes": [
                "crowded places",
                "cold coffee",
                "dishonesty"
            ]
        },
        {
            "name": "liam",
            "gender": "male",
            "want": "female",
            "likes": [
                "surfing",
                "live music",
                "tech gadgets",
                "road trips"
            ],
            "dislikes": [
                "traffic",
                "spicy food",
                "rude people"
            ]
        },
        {
            "name": "isabella",
            "gender": "female",
            "want": "male",
            "likes": [
                "baking",
                "hiking",
                "photography",
                "romantic novels"
            ],
            "dislikes": [
                "dishonesty",
                "clutter",
                "early alarms"
            ]
        },
        {
            "name": "david",
            "gender": "male",
            "want": "male",
            "likes": [
                "jazz music",
                "museums",
                "wine tasting",
                "theater"
            ],
            "dislikes": [
                "loud bars",
                "crowds",
                "spicy food"
            ]
        },
        {
            "name": "emily",
            "gender": "female",
            "want": "male",
            "likes": [
                "yoga",
                "vegan food",
                "meditation",
                "nature walks"
            ],
            "dislikes": [
                "smoking",
                "traffic jams",
                "negative people"
            ]
        },
        {
            "name": "ryan",
            "gender": "male",
            "want": "female",
            "likes": [
                "basketball",
                "bbqs",
                "road trips",
                "comedy podcasts"
            ],
            "dislikes": [
                "rainy days",
                "cold coffee",
                "bad drivers"
            ]
        }
    ]
    let userInsert = db.prepare("INSERT INTO users (name, gender, want) VALUES ($name, $gender, $want)")
    let itemInsert = db.prepare("INSERT OR IGNORE INTO items (item) VALUES ($item);");
    let likesInsert = db.prepare("INSERT INTO likes (user_id, item_id) SELECT users.id, items.id FROM users, items WHERE users.name = $name AND items.item = $item;");
    let dislikesInsert = db.prepare("INSERT INTO dislikes (user_id, item_id) SELECT users.id, items.id FROM users, items WHERE users.name = $name AND items.item = $item;");
    let embeddingInsert = db.prepare("INSERT INTO embeddings (rowid, embedding) VALUES ($userId, $embedding)");
    await Promise.all(amaDummyData.map(async (user) => {
        let userId = userInsert.run(
            {
                name: user.name,
                gender: user.gender,
                want: user.want
            }).lastInsertRowid;
        let profile = "my name is " + user.name + ", and I am a " + user.gender + " looking to meet a " + user.want + ". I enjoy " + user.likes.join(", ") + ", and I'm not a fan of " + user.dislikes.join(", ") + ".";
        let embedding = await api.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: profile,
            provider: "auto",
        });
        const embeddingBuffer = Buffer.from(new Float32Array(embedding).buffer);
        embeddingInsert.run({
            userId: userId,
            embedding: embeddingBuffer
        });
        user.likes.forEach((like) => {
            itemInsert.run({ item: like });
            likesInsert.run(
                {
                    name: user.name,
                    item: like
                });
        })
        user.dislikes.forEach((dislike) => {
            itemInsert.run({ item: dislike });
            dislikesInsert.run(
                {
                    name: user.name,
                    item: dislike
                });
        })
    }))
}

app.listen(3001, () => {
});