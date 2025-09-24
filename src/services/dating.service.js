const db = require('../configs/sqlite.config');
const api = require('../configs/huggingface.config');

exports.loadDummyData = async (data) => {
    let userInsert = db.prepare(
        'INSERT INTO users (name, gender, want) VALUES ($name, $gender, $want)'
    );
    let itemInsert = db.prepare(
        'INSERT OR IGNORE INTO items (item) VALUES ($item);'
    );
    let likesInsert = db.prepare(
        'INSERT INTO likes (user_id, item_id) SELECT users.id, items.id FROM users, items WHERE users.name = $name AND items.item = $item;'
    );
    let dislikesInsert = db.prepare(
        'INSERT INTO dislikes (user_id, item_id) SELECT users.id, items.id FROM users, items WHERE users.name = $name AND items.item = $item;'
    );
    let embeddingInsert = db.prepare(
        'INSERT INTO embeddings (rowid, embedding) VALUES ($userId, $embedding)'
    );
    await Promise.all(
        data.map(async (user) => {
            let userId = userInsert.run({
                name: user.name,
                gender: user.gender,
                want: user.want,
            }).lastInsertRowid;
            let profile =
                'my name is ' +
                user.name +
                ', and I am a ' +
                user.gender +
                ' looking to meet a ' +
                user.want +
                '. I enjoy ' +
                user.likes.join(', ') +
                ", and I'm not a fan of " +
                user.dislikes.join(', ') +
                '.';
            let embedding = await api.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: profile,
                provider: 'auto',
            });
            const embeddingBuffer = Buffer.from(
                new Float32Array(embedding).buffer
            );
            embeddingInsert.run({
                userId: userId,
                embedding: embeddingBuffer,
            });
            user.likes.forEach((like) => {
                itemInsert.run({ item: like });
                likesInsert.run({
                    name: user.name,
                    item: like,
                });
            });
            user.dislikes.forEach((dislike) => {
                itemInsert.run({ item: dislike });
                dislikesInsert.run({
                    name: user.name,
                    item: dislike,
                });
            });
        })
    );
};
