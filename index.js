const express = require("express");
const cors = require("cors");
const db = require("./configs/sqlite.config");
const api = require("./configs/huggingface.config");
const ama = require("./datasets/ama");
const loadDummyData = require("./services/ama.service");
const data = require("./datasets/ama");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/ama', require('./routes/ama.routes'));

app.listen(3001, () => {
});