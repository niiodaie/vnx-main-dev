import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes"; // Adjust this if needed

const app = express();

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🚨 Critical: Healthcheck must be ready before any async logic
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Optional: request logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

const PORT = process.env.PORT || 3001; // Required for Railway
const HOST = "0.0.0.0"; // Must be 0.0.0.0 on Railway

(async () => {
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  server.listen(PORT, HOST, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();
