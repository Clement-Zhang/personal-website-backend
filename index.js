import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.DEEPSEEK_KEY
});

app.post("/deepseek", async (req, res) => {
    const result = await openai.chat.completions.create({
        messages: [{ role: "user", content: req.body.prompt }],
        model: "deepseek/deepseek-v3-base:free",
    });
    res.json({ response: result.choices[0].message.content });
});

app.listen(3001, () => {
    console.log("working");
});