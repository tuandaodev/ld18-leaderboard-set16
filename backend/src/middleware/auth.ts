import { NextFunction, Request, Response } from "express";
import { UserRole } from "../entity/User";
import { BaseUserDto } from "../modules/admin/admin.dto";
import { extractBearerToken } from "../utils/extractBearerToken";
const jwt = require("jsonwebtoken");

// Middleware for protected route
export const protectUserRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }
  let token = extractBearerToken(req);
  if (token == null) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Authentication token is required.",
    });
  }

  try {
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);
    (req as any).admin = decoded;
    next();
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "jwt expired",
      });
    }
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid or expired authentication token.",
    });
  }
};

export const roleGuard = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === "test") {
      return next();
    }
    const userRole = ((req as any).admin as BaseUserDto)?.role;
    if (!userRole || role !== userRole) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You do not have permission to access this resource. Admin access required.",
      });
    }

    next();
  };
};
