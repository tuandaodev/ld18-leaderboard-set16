import { Router } from "express";
import { getPagingCurrentUserPartnerGamingCenterController, getPartnerGamingCenterStatusController, registerPartnerGamingCenterController, getPartnerGamingCenterDetailController, updatePartnerGamingCenterController, getPagingAllPartnerGamingCentersController, getPublicPartnerGamingCenterDetailController, searchPartnerGamingCentersForAdminController, getPartnerGamingCenterDetailForAdminController, approvePartnerGamingCenterController, rejectPartnerGamingCenterController } from "./partnerGamingCenter.controller";
import { protectUserRoute, roleGuard } from "../../middleware/auth";
import { UserRole } from "../../entity/User";

export const partnerGamingCenterRouter = Router();

// Partner Gaming Center routes
// Public routes - no auth required
partnerGamingCenterRouter.get("/all", getPagingAllPartnerGamingCentersController);
partnerGamingCenterRouter.get("/public/:id", getPublicPartnerGamingCenterDetailController);

// Protected routes - require auth
partnerGamingCenterRouter.get("/status", protectUserRoute, getPartnerGamingCenterStatusController);
partnerGamingCenterRouter.post("/register", protectUserRoute, ...(registerPartnerGamingCenterController as any));
partnerGamingCenterRouter.get("/my-gaming-centers", protectUserRoute, getPagingCurrentUserPartnerGamingCenterController);
partnerGamingCenterRouter.get("/:id", protectUserRoute, getPartnerGamingCenterDetailController);
partnerGamingCenterRouter.put("/:id", protectUserRoute, ...(updatePartnerGamingCenterController as any));

// Admin routes
partnerGamingCenterRouter.get("/admin/search", protectUserRoute, roleGuard(UserRole.ADMIN), searchPartnerGamingCentersForAdminController);
partnerGamingCenterRouter.get("/admin/:id/detail", protectUserRoute, roleGuard(UserRole.ADMIN), getPartnerGamingCenterDetailForAdminController);
partnerGamingCenterRouter.post("/admin/approve", protectUserRoute, roleGuard(UserRole.ADMIN), approvePartnerGamingCenterController);
partnerGamingCenterRouter.post("/admin/reject", protectUserRoute, roleGuard(UserRole.ADMIN), rejectPartnerGamingCenterController);