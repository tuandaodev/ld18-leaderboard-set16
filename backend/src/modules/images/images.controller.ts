import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";

import fs from 'fs';
import path from "path";
import { ALLOWED_EXTENSIONS, getImageDirPath } from "../../services/image.service";

export const getImagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const imageName = String(req.params.imageName || "").trim();
    const type = String(req.params.type || "").trim().toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(type)) {
      return res.status(400).json({ message: "Invalid image name or type" });
    }

    const imagesRoot = path.resolve(getImageDirPath());
    const candidatePath = path.resolve(path.join(imagesRoot, `${imageName}.${type}`));

    // Prevent path traversal outside imagesRoot
    if (!candidatePath.startsWith(imagesRoot + path.sep)) {
      return res.status(400).json({ message: "Invalid path" });
    }

    try {
      const stat = fs.statSync(candidatePath);
      if (!stat.isFile()) {
        return res.status(404).json({ message: "Image not found" });
      }
    } catch {
      return res.status(404).json({ message: "Image not found" });
    }

    res.sendFile(candidatePath);
  }
);

export const cleanUpUploadFolder = async () => {
  const now = Date.now();
  const HOUR_TO_KEEP = 1;
  const cutoffTime = now - HOUR_TO_KEEP * 60 * 60 * 1000;

  try {
    const filenames = fs.readdirSync('./uploads');
    filenames.forEach((file) => {
      const filePath = path.join('./uploads', file);
      try {
        const stats = fs.statSync(filePath);
        const fileModifiedTime = new Date(stats.mtime).getTime();
        if (fileModifiedTime < cutoffTime) {
          fs.unlinkSync(filePath);
          // Intentionally keep log minimal to avoid leaking paths in production logs
        }
      } catch {
        // Ignore files that might have been removed between reads
      }
    });
  } catch {
    // Ignore if uploads folder does not exist
  }
};