import {
    reformatProfile,
    getMatches,
    summarizeProfile,
} from '../services/dating.service.js';

export const reformat = async (prompt) => await reformatProfile(prompt);

export const match = async (profile) =>
    await getMatches(await summarizeProfile(profile));
