import {
    reformatProfile,
    getMatches,
    summarizeProfile,
} from '../services/dating.service.js';

export async function reformat(prompt, socket) {
    const stream = await reformatProfile(prompt);
    for await (const chunk of stream) {
        console.log('sending data');
        socket.emit('reformat', {
            type: 'res',
            chunk: chunk.choices[0].delta.content,
        });
    }
    socket.emit('reformat', { type: 'end' });
}

export const match = async (profile, callback) =>
    callback(await getMatches(await summarizeProfile(profile)));
