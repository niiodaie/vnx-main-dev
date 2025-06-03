import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create Vite server in middleware mode
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  root: path.resolve(__dirname, 'frontend'),
  configFile: false,
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },
});

app.use(vite.ssrFixStacktrace);
app.use(vite.middlewares);

app.use('*', async (req, res, next) => {
  const url = req.originalUrl;

  try {
    // Serve the index.html directly from frontend folder
    const indexPath = path.resolve(__dirname, 'frontend/index.html');
    let template;
    
    try {
      template = await import('fs').then(fs => fs.promises.readFile(indexPath, 'utf-8'));
    } catch {
      // Fallback HTML if file doesn't exist
      template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VNX Nexus - Digital Innovation Hub</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    }

    const html = await vite.transformIndexHtml(url, template);
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

const PORT = 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 VNX Nexus development server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});