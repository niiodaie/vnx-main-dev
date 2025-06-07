import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes.js';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const app = express();

// ✅ CORS setup — allow frontend on Vercel and local dev
app.use(cors({
  origin: ['https://www.visnec.ai', 'http://localhost:5173'],
  credentials: true,
}));

// Enable JSON request body parsing
app.use(express.json());

// ✅ API route
app.use('/api', routes);

// ✅ Root health check
app.get('/', (_req: Request, res: Response) => {
  res.send('VNX Backend is live ✅');
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ VNX backend running on port ${PORT}`);
});

export default app;
