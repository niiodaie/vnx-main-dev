import express from 'express';
import cors from 'cors';
import routes from './server/routes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', routes); // prefix API routes if needed

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
