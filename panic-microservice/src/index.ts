import express from 'express';
import dotenv from 'dotenv';
import { panicRouter } from './api/routes/panic';
import { logger } from './utils/logger';
import { startWorker } from './services/workerService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Start async worker (simulates background ECS processing)
startWorker();

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.status(200).send({ status: 'OK' });
});

// Panic API routes
app.use('/panic', panicRouter);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚨 AURA Panic API listening on port ${PORT}`);
});
