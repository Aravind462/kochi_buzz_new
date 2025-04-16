import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model"; // Assuming this is your User model

const SECRET_KEY = process.env.JWTPASSWORD;

declare module "express" {
  interface Request {
    user?: any;
  }
}

// Middleware to verify JWT token and attach user info to request
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers);
  

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await UserModel.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user has the required role
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
