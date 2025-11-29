import { Router } from "express";
import { 
  registerEventController,
  searchCommunityEventsForAdminController,
  getCommunityEventDetailForAdminController,
  approveCommunityEventController,
  rejectCommunityEventController
} from "./community-event.controller";
import { protectUserRoute, roleGuard } from "../../middleware/auth";
import { UserRole } from "../../entity/User";

export const communityEventRouter = Router();

// Event routes
communityEventRouter.post("/register", protectUserRoute, ...(registerEventController as any));

// Admin routes
communityEventRouter.get("/admin/search", protectUserRoute, roleGuard(UserRole.ADMIN), searchCommunityEventsForAdminController);
communityEventRouter.get("/admin/:id/detail", protectUserRoute, roleGuard(UserRole.ADMIN), getCommunityEventDetailForAdminController);
communityEventRouter.post("/admin/approve", protectUserRoute, roleGuard(UserRole.ADMIN), approveCommunityEventController);
communityEventRouter.post("/admin/reject", protectUserRoute, roleGuard(UserRole.ADMIN), rejectCommunityEventController);

