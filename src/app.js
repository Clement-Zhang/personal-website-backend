import dating from './routes/dating.routes.js';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.text());
app.use('/dating/api', dating);

app.listen(3001, () => {});
