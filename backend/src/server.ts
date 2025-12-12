import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import providerRoutes from "./routes/providerRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Servicek API Server",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      providers: "/api/providers",
      users: "/api/users"
    }
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbStatus = mongoose.connection.readyState;
    const dbStates: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };
    
    res.json({ 
      status: "OK",
      database: {
        status: dbStates[dbStatus] || "unknown",
        connected: dbStatus === 1
      }
    });
  } catch (error) {
    res.json({ 
      status: "OK",
      database: {
        status: "error",
        connected: false,
        error: (error as Error).message
      }
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});