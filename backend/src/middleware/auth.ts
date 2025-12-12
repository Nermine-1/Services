import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  
  console.log("Auth check - Header present:", !!authHeader, "Token present:", !!token);
  
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    console.log("Token verified - User:", decoded);
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  auth(req, res, () => {
    console.log("Admin auth check - User:", req.user);
    if (req.user && req.user.role === "admin") {
      console.log("Admin access granted");
      next();
    } else {
      console.log("Admin access denied - Role:", req.user?.role);
      res.status(403).json({ message: "Access denied. Admin role required." });
    }
  });
};

export { auth, adminAuth };