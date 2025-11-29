import { Request, Response } from "express";
import fs from 'fs';
import multer from "multer";
import path from "path";
import { Brackets, In } from "typeorm";
import { AppDataSource } from "../../data-source";
import { AdminLog } from "../../entity/AdminLog";
import { CommunityEvent, CommunityEventStatus } from "../../entity/CommunityEvent";
import { Leader, LeaderStatus } from "../../entity/Leader";
import { Notification, NotificationType } from "../../entity/Notification";
import { asyncHandler, handleValidationErrors } from "../../middleware/async";
import { cleanupTempFilesOnErrorHandler } from "../../middleware/cleanup.file.handler";
import { getImageDirPath, sharedMulterOptions } from "../../services/image.service";
import { extractBearerToken } from "../../utils/extractBearerToken";
import { advancedResult } from "../../utils/pagination";
import { BaseUserDto } from "../admin/admin.dto";
import { validateRegisterEvent } from "./community-event.validator";
import rateLimit from "express-rate-limit";

const jwt = require("jsonwebtoken");
const { xss } = require('express-xss-sanitizer');

// Configure multer for file upload
const uploadBanner = multer(sharedMulterOptions).fields([
  { name: 'bannerFile', maxCount: 1 }
]);

const registerEventLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Bạn đã đăng ký sự kiện quá số lần cho phép. Vui lòng thử lại sau.",
    });
  },
});
export const registerEventController = [
  registerEventLimiter,
  uploadBanner,
  xss(),
  validateRegisterEvent,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
  
      let token = extractBearerToken(req);
      let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

      const { 
        eventName, 
        city, 
        district, 
        registrationDeadline, 
        eventStartTime, 
        eventEndTime, 
        venueAddress, 
        venueName, 
        eventType, 
        deviceType, 
        eventDescription, 
        eventScale, 
        supportLevel 
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const bannerFile = files['bannerFile'] ? files['bannerFile'][0] : null;
      if (!bannerFile) {
        throw new Error("Vui lòng tải lên ảnh banner");
      }

      // Parse dates (already validated by express-validator)
      const regDeadline = new Date(registrationDeadline);
      const startTime = new Date(eventStartTime);
      const endTime = new Date(eventEndTime);

      // Validate that user has Leader status
      const leader = await Leader.findOne({ where: { userId: decoded.id, status: In([LeaderStatus.Approved]) } });
      if (!leader) {
        throw new Error("Bạn chưa đăng ký thành thủ lĩnh cộng đồng. Vui lòng đăng ký thành thủ lĩnh cộng đồng trước khi tổ chức sự kiện.");
      }

      const event = new CommunityEvent();

      event.userId = decoded.id;
      event.eventName = eventName;
      event.city = city;
      event.district = district;
      event.registrationDeadline = regDeadline;
      event.eventStartTime = startTime;
      event.eventEndTime = endTime;
      event.venueAddress = venueAddress;
      event.venueName = venueName;
      event.eventType = eventType;
      event.deviceType = deviceType;
      event.eventDescription = eventDescription;
      event.eventScale = eventScale;
      event.supportLevel = supportLevel;

      // Update banner
      const publicFolderPath = getImageDirPath();
      if (!fs.existsSync(publicFolderPath)) {
        fs.mkdirSync(publicFolderPath, { recursive: true });
      }

      const timestamp = new Date().getTime();

      try {
        // Banner
        const bannerFileName = `${decoded.id}_event_banner_${timestamp}`;
        const bannerExtension = path.extname(bannerFile.originalname);
        const formattedBannerFilename = `${decoded.id}_event_banner_${timestamp}${bannerExtension}`;
        const clonedBannerFilePath = path.join(publicFolderPath, formattedBannerFilename);
        fs.copyFileSync(bannerFile.path, clonedBannerFilePath);
        fs.unlink(bannerFile.path, (err) => {
          if (err) {
            console.error('Error deleting the uploaded banner file:', err);
          }
        });

        const bannerExt = bannerExtension ? bannerExtension.slice(1) : 'jpg';
        event.bannerFile = `/images/${bannerFileName}/${bannerExt}`;

      } catch (err) {
        throw new Error("error_upload_banner_try_again");
      }

      await event.save();
  
      res.status(200).json({
        success: true,
        data: event,
      });
    }
  ),
  cleanupTempFilesOnErrorHandler
];

// Admin: Search community events
export const searchCommunityEventsForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let page: number = parseInt((req.query.page as string) || "1");
    let pageSize: string | undefined = req.query.pageSize as string;
    let limitStr: string | undefined = req.query.limit as string;
    let limit: number = pageSize ? parseInt(pageSize) : (limitStr ? parseInt(limitStr) : 10);
    let sortDesc: boolean = Boolean((req.query.sortDesc as string) || false);
    let searchContent: string | undefined = req.query.searchContent as string;
    let status: number | undefined = req.query.status !== undefined ? parseInt(req.query.status as string) : undefined;

    let sortField: string = "id";
    let pagedItems = await advancedResult(
      CommunityEvent,
      page,
      limit,
      sortField,
      sortDesc,
      new Brackets((qb) => {
        qb.where("1 = 1");
        if (status !== undefined) {
          qb.andWhere("entity.status = :status", { status: status });
        }
        if (searchContent && searchContent?.length > 0) {
          qb.andWhere(
            new Brackets((subQb) => {
              subQb.where("entity.eventName ILIKE :searchContent", { searchContent: `%${searchContent}%` });
            })
          );
        }
      }),
    );

    res.status(200).json({
      success: true,
      data: pagedItems,
    });
  }
);

// Admin: Get community event detail
export const getCommunityEventDetailForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let id = req.params.id;
    if (!id) {
      throw new Error("bad request");
    }

    let event = await CommunityEvent.findOneByOrFail({
      id: +id,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  }
);

// Admin: Approve community event
export const approveCommunityEventController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const { eventId } = req.body;
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const eventRepository = queryRunner.manager.getRepository(CommunityEvent);
      const event = await eventRepository.findOneBy({ id: eventId });

      if (event == null) {
        throw new Error("Cannot find event.");
      }

      if (event.status != CommunityEventStatus.New) {
        throw new Error("Status is invalid to approve.");
      }

      // Update status to approved
      event.status = CommunityEventStatus.Approved;
      await eventRepository.save(event);

      // [Log]
      const adminLog = new AdminLog();
      adminLog.adminId = decoded.id;
      adminLog.action = `Admin ${decoded.id} approved community event: #Id ${event.id}`;
      await queryRunner.manager.getRepository(AdminLog).save(adminLog);

      // [Notification]
      const notification = new Notification();
      notification.userId = event.userId;
      notification.type = NotificationType.SUCCESS;
      notification.title = "Sự kiện cộng đồng";
      notification.message = `Sự kiện cộng đồng "${event.eventName}" của bạn đã được duyệt.`;
      notification.relatedEntityId = event.id;
      notification.relatedEntityType = "CommunityEvent";
      notification.isRead = false;
      await queryRunner.manager.getRepository(Notification).save(notification);

      await queryRunner.commitTransaction();

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

// Admin: Reject community event
export const rejectCommunityEventController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const { eventId, rejectionReason } = req.body;
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new Error("Rejection reason is required");
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const eventRepository = queryRunner.manager.getRepository(CommunityEvent);
      const event = await eventRepository.findOneBy({ id: eventId });

      if (event == null) {
        throw new Error("Cannot find event.");
      }

      if (event.status == CommunityEventStatus.Approved) {
        throw new Error("Status is invalid to reject.");
      }

      event.status = CommunityEventStatus.Rejected;
      event.rejectionReason = rejectionReason.trim();
      await eventRepository.save(event);

      // [Log]
      const adminLog = new AdminLog();
      adminLog.adminId = decoded.id;
      adminLog.action = `Admin ${decoded.id} rejected community event: #Id ${event.id} - Reason: ${rejectionReason}`;
      await queryRunner.manager.getRepository(AdminLog).save(adminLog);

      // [Notification]
      const notification = new Notification();
      notification.userId = event.userId;
      notification.type = NotificationType.ERROR;
      notification.title = "Sự kiện cộng đồng";
      notification.message = `Sự kiện cộng đồng "${event.eventName}" của bạn đã bị từ chối. Lý do: ${rejectionReason.trim()}`;
      notification.relatedEntityId = event.id;
      notification.relatedEntityType = "CommunityEvent";
      notification.isRead = false;
      await queryRunner.manager.getRepository(Notification).save(notification);

      await queryRunner.commitTransaction();

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

