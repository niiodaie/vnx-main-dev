import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes"; // adjust this path if needed

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Make healthcheck available immediately
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Logging middleware (optional)
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJsonResponse: any;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      console.log(logLine);
    }
  });

  next();
});

// ✅ Listen immediately before routes (important for Railway healthcheck!)
const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0"; // important
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
});

// Load async routes AFTER server is listening
registerRoutes(app).catch((err) => {
  console.error("Route registration failed:", err);
});
