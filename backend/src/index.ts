import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

const PORT = parseInt(process.env.PORT || '5000', 10);

const start = async () => {
  await connectDB();

  // Bind to 0.0.0.0 so Railway's proxy can reach the app
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Umurava API running on http://0.0.0.0:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

start().catch((err) => {
  logger.error(`Failed to start server: ${err}`);
  process.exit(1);
});