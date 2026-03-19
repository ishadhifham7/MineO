import { buildApp } from './app';
import { env } from './config/env';

/**
 * Start the server
 */
async function start() {
  try {
    const app = await buildApp();
    const port = Number(process.env.PORT) || env.PORT;
    const baseUrl = env.PUBLIC_BASE_URL || `http://localhost:${port}`;

    await app.listen({
      port,
      host: '0.0.0.0',
    });

    app.log.info(`🚀 Server running on ${baseUrl}`);

    if (env.NODE_ENV === 'development') {
      app.log.info(`📚 API Documentation available at ${baseUrl}/docs`);
    }

    // Graceful shutdown - handle multiple signals including Windows-specific ones
    const signals = ['SIGINT', 'SIGTERM', 'SIGBREAK'] as const;

    let isShuttingDown = false;
    const shutdown = async (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      app.log.info(`Received ${signal}, closing server gracefully...`);
      try {
        await app.close();
        app.log.info('Server closed successfully');
        process.exit(0);
      } catch (err) {
        app.log.error({ err }, 'Error during shutdown');
        process.exit(1);
      }
    };

    signals.forEach((signal) => {
      process.on(signal, () => {
        shutdown(signal).catch(console.error);
      });
    });

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      app.log.error({ error }, 'Uncaught Exception');
      shutdown('uncaughtException').catch(console.error);
    });

    process.on('unhandledRejection', (reason) => {
      app.log.error({ reason }, 'Unhandled Rejection');
      shutdown('unhandledRejection').catch(console.error);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

start();
