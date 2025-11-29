import { Request, Response } from "express";
import fs from 'fs';
import multer from "multer";
import path from "path";
import { Brackets } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Event } from "../../entity/Event";
import { asyncHandler, handleValidationErrors } from "../../middleware/async";
import { getImageDirPath, sharedMulterOptions } from "../../services/image.service";
import { extractBearerToken } from "../../utils/extractBearerToken";
import { advancedResult } from "../../utils/pagination";
import { BaseUserDto } from "../admin/admin.dto";
import { validateCreateEvent, validateUpdateEvent } from "./event.validator";
import { cleanupTempFilesOnErrorHandler } from "../../middleware/cleanup.file.handler";

const jwt = require("jsonwebtoken");
const { xss } = require('express-xss-sanitizer');

// Configure multer for file upload
const uploadBanner = multer(sharedMulterOptions).fields([
  { name: 'bannerFile', maxCount: 1 }
]);

export const createEventController = [
  uploadBanner,
  xss(),
  ...validateCreateEvent,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
  
      let token = extractBearerToken(req);
      let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

      const { 
        eventName, 
        isPublic,
        eventUrl,
        priority
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const bannerFile = files['bannerFile'] ? files['bannerFile'][0] : null;
      if (!bannerFile) {
        throw new Error("Vui lòng tải lên ảnh banner");
      }

      const event = new Event();

      event.eventName = eventName;
      event.isPublic = isPublic ?? false;
      event.eventUrl = eventUrl;
      event.priority = priority ? parseInt(priority) : 0;
      
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

export const searchEventsForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let page: number = parseInt((req.query.page as string) || "1");
    let limit: number = parseInt((req.query.limit as string) || "10");
    let sortDesc: boolean = Boolean((req.query.sortDesc as string) || false);
    let searchContent: string | undefined = req.query.searchContent as string;
    let status: number | undefined = req.query.status !== undefined ? parseInt(req.query.status as string) : undefined;

    let sortField: string = "id";
    let pagedItems = await advancedResult(
      Event,
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
              subQb.where("entity.eventName ILIKE :searchContent", { searchContent: `%${searchContent}%` })
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

export const getPublicEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    let page: number = parseInt((req.query.page as string) || "1");
    let limit: number = parseInt((req.query.limit as string) || "10");

    // Pagination calculation
    const currentPage = page || 1;
    const pageSize = limit || 10;
    if (pageSize > 10) {
      throw new Error("pageSize must be less than 10");
    }
    
    const offset = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;

    const baseQb = AppDataSource.getRepository(Event)
      .createQueryBuilder("entity")
      .where("entity.isPublic = :isPublic", { isPublic: true });

    // Sort by priority (descending), then by id (descending)
    baseQb
      .orderBy("entity.priority", "DESC")
      .addOrderBy("entity.id", "DESC")
      .offset(offset)
      .limit(pageSize);

    const [data, total] = await baseQb.getManyAndCount();

    const pagedItems = {
      total,
      page: currentPage,
      pageSize,
      result: data,
      hasNext: endIndex < total,
    };

    res.status(200).json({
      success: true,
      data: {
        ...pagedItems,
        result: pagedItems.result.map((x: Event) => {
          return {
            id: x.id,
            eventName: x.eventName,
            bannerFile: x.bannerFile,
            eventUrl: x.eventUrl,
            priority: x.priority,
          };
        }),
      },
    });
  }
);

export const getPublicEventDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    let id = req.params.id;
    if (!id) {
      throw new Error("bad request");
    }

    let event = await Event.findOneByOrFail({
      id: +id,
      isPublic: true,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  }
);

export const getEventDetailForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let id = req.params.id;
    if (!id) {
      throw new Error("bad request");
    }

    let event = await Event.findOneByOrFail({
      id: +id,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  }
);

export const updateEventController = [
  uploadBanner,
  xss(),
  ...validateUpdateEvent,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
      let token = extractBearerToken(req);
      let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

      const { id } = req.params;
      if (!id) {
        throw new Error("bad request");
      }

      const event = await Event.findOneByOrFail({ id: +id });

      const { 
        eventName, 
        isPublic,
        eventUrl,
        priority
      } = req.body;

      event.eventName = eventName;
      event.isPublic = isPublic ?? false;
      event.eventUrl = eventUrl;
      if (priority !== undefined) {
        event.priority = parseInt(priority);
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const bannerFile = files['bannerFile'] ? files['bannerFile'][0] : null;

      // Update banner if provided
      if (bannerFile) {
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

