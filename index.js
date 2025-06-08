const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { OpenAI } = require("openai");

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
        messages: [
        {
            role: "system",
            content: req.body.context
        },
        {
            role: "user",
            content: req.body.prompt
        }],
        model: "deepseek/deepseek-chat-v3-0324:free"
    });
    res.json({ response: result.choices[0].message.content });
});

app.listen(3001, () => {
});