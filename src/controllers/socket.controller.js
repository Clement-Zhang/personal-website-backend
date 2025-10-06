import { reformat, match } from '../controllers/dating.controller.js';

export const reformat = async (prompt) => await reformatProfile(prompt);

export const match = async (profile) =>
    await getMatches(await summarizeProfile(profile));
