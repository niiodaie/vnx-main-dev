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
    // Read index.html
    let template = await vite.transformIndexHtml(url, `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VNX Nexus - Digital Innovation Hub</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
    `);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
  } catch (e) {
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 VNX Nexus development server running at http://localhost:${PORT}`);
});