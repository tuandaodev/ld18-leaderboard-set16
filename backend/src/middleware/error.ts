import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  process.env.NODE_ENV === "development"
    ? console.error(`[ERROR] ${err.name} : ${err.message}`)
    : {};

  // Determine status code based on error message or status
  let statusCode = 400;
  if (err.statusCode) {
    statusCode = err.statusCode;
  } else if (err.message?.toLowerCase().includes("unauthorized")) {
    statusCode = 401;
  } else if (err.message?.toLowerCase().includes("forbidden")) {
    statusCode = 403;
  } else if (err.message?.toLowerCase().includes("not found")) {
    statusCode = 404;
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || "Server error",
  });
};
