import express, { Express, Request, Response, NextFunction } from "express";
import { connectDB } from "./database"; // Import your DB connection function
import routes from "./routes"; // Import routes from routes.ts
import cors from "cors";

const app: Express = express();
const port = 8000;

// Middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function (...args) {
    console.log(
      `${req.hostname}:${req.socket.remotePort} - "${req.method} ${req.originalUrl}" ${res.statusCode}`
    );
    return originalSend.apply(this, args);
  };
  next();
});

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors());

// Use routes
app.use(routes);

// Start MongoDB connection
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Application running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Basic health check route
app.get("/", (req: Request, res: Response) => {
  res.send({ status: "running" });
});
