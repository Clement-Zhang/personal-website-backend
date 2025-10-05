import { dating as datingCollection } from '../configs/mongo.config.js'; //renamed only to avoid naming conflict
import { dating as datingData } from '../datasets/dating.js';
import huggingfaceAPI from '../configs/huggingface.config.js';
import openaiAPI from '../configs/openai.config.js';
import 'dotenv/config';

export async function reformatProfile(profile) {
    const prompt = [
        {
            role: 'system',
            content:
                'You are being used in a dating application. Reformat the user\'s input into this exact structure: "I am a {user\'s gender} looking to meet a {match\'s gender}. I enjoy {likes}, and I\'m not a fan of {dislikes}." Remove parts of the sentence if the info is missing, but keep the rest intact. If only one gender is given, assume the other is the opposite; if both are missing, respond only with "fail". Include likes/dislikes if at least one is present; if both gender info and preferences are missing, respond only with "fail". Ignore names completely and never paraphrase or add info.',
        },
        {
            role: 'user',
            content: profile,
        },
    ];
    const response =
        process.env.ACTIVE_API === 'openai'
            ? await openaiAPI.chat.completions.create({
                  model: 'deepseek/deepseek-chat-v3.1:free',
                  messages: prompt,
              })
            : await huggingfaceAPI.chatCompletion({
                  provider: 'auto',
                  model: 'deepseek-ai/DeepSeek-V3-0324',
                  messages: prompt,
              });
    return response.choices[0].message.content.replace(/['"]+/g, '');
}

export async function summarizeProfile(profile) {
    return await huggingfaceAPI.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: profile,
        provider: 'auto',
    });
}

export async function loadTestUsers() {
    datingData.forEach(async (user) => {
        let profile =
            'I am a ' +
            user.gender +
            ' looking to meet a ' +
            user.want +
            '. I enjoy ' +
            user.likes.join(', ') +
            ", and I'm not a fan of " +
            user.dislikes.join(', ') +
            '.';
        let summary = await summarizeProfile(profile);
        await datingCollection.insertOne({ ...user, summary: summary });
    });
}

export async function getMatches(embedding) {
    return await datingCollection
        .aggregate([
            {
                $vectorSearch: {
                    exact: false,
                    index: 'summary',
                    limit: 5,
                    numCandidates: 100,
                    path: 'summary',
                    queryVector: embedding,
                },
            },
            { $project: { summary: 0, _id: 0 } },
        ])
        .toArray();
}

export async function deleteUsers() {
    await datingCollection.deleteMany();
}
