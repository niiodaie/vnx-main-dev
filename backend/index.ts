 import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./server/routes";

const app = express();

// Setup CORS (allow dev + prod frontends)
app.use(cors({
  origin: process.env.FRONTEND_URL || [
    "http://localhost:5173",
    "https://your-vercel-app.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Healthcheck endpoint for Railway
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// 🪵 Logging for /api routes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  const originalJson = res.json.bind(res);
  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalJson(body, ...args);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      let log = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const preview = JSON.stringify(capturedJsonResponse);
        log += ` :: ${preview.length > 80 ? preview.slice(0, 77) + "…" : preview}`;
      }
      console.log(log);
    }
  });

  next();
});

(async () => {
  // Register routes (e.g., /api endpoints)
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Error ${status}: ${message}`);
    res.status(status).json({ message });
  });

  // 🔥 Start the server
  const PORT = Number(process.env.PORT) || 3001;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  });
})();
