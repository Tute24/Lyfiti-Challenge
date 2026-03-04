import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tasksRouter } from './routers/tasks-router';
import { errorHandler } from './middlewares/error-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use('/tasks', tasksRouter);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
