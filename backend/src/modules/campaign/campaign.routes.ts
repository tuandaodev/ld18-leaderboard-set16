import { Router } from "express";
import { protectUserRoute } from "../../middleware/auth";
import { findAllCampaignController } from "./campaign.controller";

export const campaignRoutes = Router();
campaignRoutes.get("/find-all", protectUserRoute, findAllCampaignController);