import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS to allow Vercel frontend
app.use(cors({
  origin: ['https://www.visnec.ai', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());

// Register routes
app.use('/api', routes);

// Root health check (optional)
app.get('/', (_req: Request, res: Response) => {
  res.send('VNX Backend is live ✅');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ VNX backend running on port ${PORT}`);
});

export default app;

