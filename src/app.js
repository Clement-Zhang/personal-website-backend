const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.text());
app.use('/ama/api', require('./routes/ama.routes'));

app.listen(3001, () => {
});