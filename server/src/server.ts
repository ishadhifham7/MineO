import { buildApp } from './app';
import { env } from './config/env';

/**
 * Start the server
 */
async function start() {
  try {
    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    app.log.info(`🚀 Server running on http://localhost:${env.PORT}`);

    if (env.NODE_ENV === 'development') {
      app.log.info(`📚 API Documentation available at http://localhost:${env.PORT}/docs`);
    }

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        app.log.info(`Received ${signal}, closing server...`);
        await app.close();
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

start();
