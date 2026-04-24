import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

const PORT = parseInt(process.env.PORT || '5000', 10);

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`🚀 Umurava API running on http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

start().catch((err) => {
  logger.error(`Failed to start server: ${err}`);
  process.exit(1);
});
