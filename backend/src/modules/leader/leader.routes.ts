import { Router } from "express";
import { UserRole } from "../../entity/User";
import { protectUserRoute, roleGuard } from "../../middleware/auth";
import {
  approveLeaderController,
  exportLeaderboardToCSVController,
  getAllLeadersController,
  getLeaderDetailController,
  getLeaderDetailForAdminController,
  getLeaderStatusController,
  getLeaderboardController,
  registerLeaderController,
  rejectLeaderController,
  searchLeadersForAdminController,
  updateLeaderTotalPointController
} from "./leader.controller";

export const leaderRouter = Router();

// Public routes
leaderRouter.get("/all", getAllLeadersController);
leaderRouter.get("/leaderboard", getLeaderboardController);
leaderRouter.get("/:id/detail", getLeaderDetailController);

// Leader routes
leaderRouter.get("/status", protectUserRoute, getLeaderStatusController);
leaderRouter.post("/register", protectUserRoute, ...(registerLeaderController as any));

// Admin routes
leaderRouter.get("/admin/search", protectUserRoute, roleGuard(UserRole.ADMIN), searchLeadersForAdminController);
leaderRouter.get("/admin/:id/detail", protectUserRoute, roleGuard(UserRole.ADMIN), getLeaderDetailForAdminController);
leaderRouter.post("/admin/approve", protectUserRoute, roleGuard(UserRole.ADMIN), approveLeaderController);
leaderRouter.post("/admin/reject", protectUserRoute, roleGuard(UserRole.ADMIN), rejectLeaderController);
leaderRouter.post("/admin/update-total-point", protectUserRoute, roleGuard(UserRole.ADMIN), updateLeaderTotalPointController);
leaderRouter.get("/admin/export-leaderboard-csv", protectUserRoute, roleGuard(UserRole.ADMIN), exportLeaderboardToCSVController);
