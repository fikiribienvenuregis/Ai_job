import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '0.0.0.0'; // CRITICAL — Railway requires 0.0.0.0, not localhost

const start = async () => {
  await connectDB();

  app.listen(PORT, HOST, () => {
    logger.info(`🚀 Umurava API running on http://${HOST}:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

start().catch((err) => {
  logger.error(`Failed to start server: ${err}`);
  process.exit(1);
});