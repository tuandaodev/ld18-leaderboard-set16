import { Router } from "express";
import { UserRole } from "../../entity/User";
import { protectUserRoute, roleGuard } from "../../middleware/auth";
import {
  deleteAdminController,
  findAdminController,
  findAllAdminController,
  findAllContentController,
  updateAdminController,
  uploadContentController,
  toggleTwoFactorAuthController
} from "./admin.controller";

export const adminRoutes = Router();
// For VNG Admin
adminRoutes.get("/find/:id", protectUserRoute, roleGuard(UserRole.ADMIN), findAdminController);
adminRoutes.get("/findAll", protectUserRoute, roleGuard(UserRole.ADMIN), findAllAdminController);
adminRoutes.patch("/update", protectUserRoute, roleGuard(UserRole.ADMIN), updateAdminController);
adminRoutes.delete(
  "/delete/:id",
  protectUserRoute,
  roleGuard(UserRole.ADMIN),
  deleteAdminController
);
adminRoutes.patch(
  "/toggle-2fa/:id",
  protectUserRoute,
  roleGuard(UserRole.ADMIN),
  toggleTwoFactorAuthController
);

adminRoutes.get("/content/find-all",
  protectUserRoute,
  roleGuard(UserRole.ADMIN),
  findAllContentController
);

adminRoutes.post("/content/update",
  protectUserRoute,
  roleGuard(UserRole.ADMIN),
  ...(uploadContentController as any)
);

// Start Campaign
// adminRoutes.post("/campaigns/create",
//   protectUserRoute,
//   roleGuard(UserRole.ADMIN),
//   addCampaignController
// );

// adminRoutes.post("/campaigns/update",
//   protectUserRoute,
//   roleGuard(UserRole.ADMIN),
//   updateCampaignController
// );

// adminRoutes.get("/campaigns/search",
//   protectUserRoute,
//   roleGuard(UserRole.ADMIN),
//   searchCampaignsForAdminController
// );

// adminRoutes.get("/campaigns/:id/detail",
//   protectUserRoute,
//   roleGuard(UserRole.ADMIN),
//   getCampaignDetailForAdminController
// );

// adminRoutes.get("/campaigns/find-all",
//   protectUserRoute,
//   roleGuard(UserRole.ADMIN),
//   getAllCampaignsForAdminController
// );
// End Campaign