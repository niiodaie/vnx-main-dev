import express from 'express';
import cors from 'cors';
import routes from './routes.js'; // assuming routes.ts compiles to .js

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Port config with explicit number
const PORT: number = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Optional: error handling demo
process.on('unhandledRejection', (err: unknown) => {
  console.error('Unhandled promise rejection:', err);
});