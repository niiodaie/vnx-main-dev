import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
