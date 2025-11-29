import { Router } from "express";
import { protectUserRoute } from "../../middleware/auth";
import {
  getNotificationsController,
  markNotificationsAsReadController,
  getUnreadNotificationCountController,
} from "./notification.controller";

export const notificationRouter = Router();

// All notification routes require authentication
notificationRouter.get("/", protectUserRoute, getNotificationsController);
notificationRouter.get("/unread-count", protectUserRoute, getUnreadNotificationCountController);
notificationRouter.post("/mark-read-multiple", protectUserRoute, markNotificationsAsReadController);

