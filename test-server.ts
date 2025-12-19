import { server } from './app.ts';
import { PORT } from './config/env.config.ts';

const testServer = server.app.listen(PORT || 3000, () => {
  console.log(`Test server running at http://localhost:${PORT || 3000}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  testServer.close(() => {
    console.log('Test server closed');
    process.exit(0);
  });
});
