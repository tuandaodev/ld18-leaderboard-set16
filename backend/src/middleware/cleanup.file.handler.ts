import { ErrorRequestHandler, Request } from "express";
import fs from 'fs';

const cleanupUploadedFiles = (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (!files) {
    return;
  }

  Object.values(files).forEach((fileArray) => {
    fileArray?.forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Error deleting temporary upload file:", err);
          } else {
            console.log("Deleted temporary upload file:", file.path);
          }
        });
      }
    });
  });
};

export const cleanupTempFilesOnErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  cleanupUploadedFiles(req as Request);
  next(err);
};