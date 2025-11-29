import { Router } from "express";
import { UserRole } from "../../entity/User";
import { protectUserRoute, roleGuard } from "../../middleware/auth";
import { findAllLogController } from "./log.controller";

export const logRouter = Router()

logRouter.get("/findAll", protectUserRoute, roleGuard(UserRole.ADMIN), findAllLogController)