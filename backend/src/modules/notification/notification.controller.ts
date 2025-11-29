import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { extractBearerToken } from "../../utils/extractBearerToken";
import { BaseUserDto } from "../admin/admin.dto";
import {
  getNotifications,
  markNotificationsAsRead,
  getUnreadNotificationCount,
} from "./notification.service";

const jwt = require("jsonwebtoken");

// Get notifications for current user
export const getNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    let page: number = parseInt((req.query.page as string) || "1");
    let pageSize: string | undefined = req.query.pageSize as string;
    let limitStr: string | undefined = req.query.limit as string;
    let limit: number = pageSize ? parseInt(pageSize) : (limitStr ? parseInt(limitStr) : 10);
    let sortDesc: boolean = req.query.sortDesc === 'true' ? true : false;
    let searchContent: string | undefined = req.query.searchContent as string;
    let isRead: boolean | undefined = req.query.isRead !== undefined ? req.query.isRead === "true" : undefined;

    if (limit > 10) {
      throw new Error("pageSize/limit must be less than 10");
    }

    let sortField: string = "id";
    const notifications = await getNotifications(
      decoded.id,
      page,
      limit,
      sortField,
      sortDesc,
      searchContent,
      isRead
    );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  }
);

// Mark multiple notifications as read
export const markNotificationsAsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const { notificationIds } = req.body;
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw new Error("Notification IDs array is required");
    }

    await markNotificationsAsRead(notificationIds, decoded.id);

    res.status(200).json({
      success: true,
    });
  }
);

// Get unread notification count
export const getUnreadNotificationCountController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const count = await getUnreadNotificationCount(decoded.id);

    res.status(200).json({
      success: true,
      data: { count },
    });
  }
);


