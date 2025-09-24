const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.text());
app.use('/dating/api', require('./routes/dating.routes'));

app.listen(3001, () => {
});