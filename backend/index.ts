import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes"; // Make sure this path is correct

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Healthcheck for Railway
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJson: any = null;

  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    capturedJson = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      let log = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJson) {
        log += ` :: ${JSON.stringify(capturedJson)}`;
      }
      if (log.length > 120) log = log.slice(0, 117) + "...";
      console.log(log);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    // Global Error Handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || 500;
      const message = err.message || "Internal Server Error";
      console.error(`Error ${status}: ${message}`);
      res.status(status).json({ message });
    });

    const PORT = Number(process.env.PORT) || 3001;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ VNX backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("🚨 Failed to initialize server:", err);
    process.exit(1);
  }
})();
