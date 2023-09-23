import path from 'path';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __dirname = path.resolve();

dotenv.config();

if (process.env.NODE_ENV === undefined) {
  dotenv.config({ path: '../.env' });
}

connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
  }),
);

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
      .yellow.bold,
  ),
);
