import { Router } from "express";
import { createEventController, searchEventsForAdminController, getEventDetailForAdminController, updateEventController, getPublicEventsController, getPublicEventDetailController } from "./event.controller";
import { protectUserRoute, roleGuard } from "../../middleware/auth";
import { UserRole } from "../../entity/User";

export const eventRouter = Router();

// Public event routes
eventRouter.get("/public", getPublicEventsController);
eventRouter.get("/public/:id", getPublicEventDetailController);

// Event routes for ADMIN
eventRouter.post("/admin/create", protectUserRoute, roleGuard(UserRole.ADMIN), ...(createEventController as any));
eventRouter.get("/admin/search", protectUserRoute, roleGuard(UserRole.ADMIN), searchEventsForAdminController);
eventRouter.get("/admin/:id/detail", protectUserRoute, roleGuard(UserRole.ADMIN), getEventDetailForAdminController);
eventRouter.post("/admin/:id/update", protectUserRoute, roleGuard(UserRole.ADMIN), ...(updateEventController as any));

