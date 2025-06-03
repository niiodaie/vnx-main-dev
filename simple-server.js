import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Determine static files directory (dist for production, frontend for development)
const isProduction = process.env.NODE_ENV === 'production';
const staticDir = isProduction ? path.join(__dirname, 'dist') : path.join(__dirname, 'frontend');

console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
console.log(`Serving static files from: ${staticDir}`);

// Serve static files
app.use(express.static(staticDir));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    staticDir: staticDir
  });
});

// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'VNX Nexus API working', version: '1.0.0' });
});

// Serve the main index.html for the root route and SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(staticDir, 'index.html');
  
  // Check if index.html exists in the static directory
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback to embedded HTML if no index.html found
    console.log('No index.html found, using embedded fallback');
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>VNX Nexus - Digital Innovation Hub</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div id="root">
              <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div class="container mx-auto px-4 py-16">
                  <div class="text-center">
                    <h1 class="text-6xl font-bold text-gray-900 mb-6">VNX Nexus</h1>
                    <p class="text-xl text-gray-600 mb-8">Digital Innovation Hub</p>
                    <div class="flex justify-center space-x-4 mb-12">
                      <button class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
                        Explore Tools
                      </button>
                      <button class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700">
                        Visit Platforms
                      </button>
                      <button class="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700">
                        Discover Experiences
                      </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-2">Tools</h3>
                        <p class="text-gray-600">Handy utilities that solve real-world problems</p>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-2">Platforms</h3>
                        <p class="text-gray-600">Interactive launchpads and service layers</p>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-2">Directories</h3>
                        <p class="text-gray-600">Discover niche resources by category</p>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-2">Resources</h3>
                        <p class="text-gray-600">Templates, guides, and downloadable kits</p>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-2">Community</h3>
                        <p class="text-gray-600">Peer collaboration and feedback forums</p>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-2">Marketplace</h3>
                        <p class="text-gray-600">Digital products, services, and SaaS tools</p>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-2">Insights</h3>
                        <p class="text-gray-600">Trends, forecasts, and business analytics</p>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-2">Experience</h3>
                        <p class="text-gray-600">Immersive digital journeys and exploration</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VNX Nexus server running on port ${PORT}`);
});