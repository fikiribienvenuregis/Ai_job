import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug route — confirms routes file is loaded
app.get('/debug', (_req, res) => {
  res.json({ status: 'debug ok', node_env: process.env.NODE_ENV });
});

// Load routes with error catching so startup crash is visible
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const routes = require('./routes').default;
  app.use('/api', routes);
  console.log('✅ Routes mounted successfully');
} catch (err) {
  console.error('❌ ROUTES FAILED TO LOAD:', err);
}

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;