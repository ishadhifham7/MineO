import { buildApp } from './app';
import { env } from './config/env';

/**
 * Check if port is already in use and kill the process
 */
async function ensurePortFree(port: number): Promise<void> {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  try {
    // Check if port is in use (Windows)
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    if (stdout.includes('LISTENING')) {
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0') {
            console.log(`⚠️  Port ${port} is in use by PID ${pid}. Attempting to free it...`);
            try {
              await execAsync(`taskkill /F /PID ${pid}`);
              console.log(`✅ Port ${port} freed successfully`);
              // Wait a bit for the port to be fully released
              await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (killError) {
              console.error(`❌ Failed to kill process ${pid}:`, killError);
            }
          }
        }
      }
    }
  } catch (error) {
    // Port is free or error checking - continue
  }
}

/**
 * Start the server
 */
async function start() {
  try {
    // Ensure port is free before starting
    await ensurePortFree(env.PORT);

    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    app.log.info(`🚀 Server running on http://localhost:${env.PORT}`);

    if (env.NODE_ENV === 'development') {
      app.log.info(`📚 API Documentation available at http://localhost:${env.PORT}/docs`);
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
