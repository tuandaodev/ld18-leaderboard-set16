import { Router } from "express";
import { findAllContentController } from "./content.controller";

export const contentRoutes = Router();
contentRoutes.get("/find-all", findAllContentController);