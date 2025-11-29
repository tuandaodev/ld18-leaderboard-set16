import { Router } from "express";
import { getImagesController } from "./images.controller";
export const imageRouter = Router();

// Both Admin
imageRouter.get("/:imageName/:type", getImagesController);