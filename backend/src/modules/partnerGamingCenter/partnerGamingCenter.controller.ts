import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import fs from 'fs';
import multer from "multer";
import path from "path";
import { Brackets } from "typeorm";
import { AppDataSource } from "../../data-source";
import { AdminLog } from "../../entity/AdminLog";
import { Notification, NotificationType } from "../../entity/Notification";
import { PartnerGamingCenter, PartnerGamingCenterStatus } from "../../entity/PartnerGamingCenter";
import { asyncHandler, handleValidationErrors } from "../../middleware/async";
import { cleanupTempFilesOnErrorHandler } from "../../middleware/cleanup.file.handler";
import { getImageDirPath, sharedMulterOptions } from "../../services/image.service";
import { extractBearerToken } from "../../utils/extractBearerToken";
import { advancedResult } from "../../utils/pagination";
import { BaseUserDto } from "../admin/admin.dto";
import { validateRegisterPartnerGamingCenter, validateUpdatePartnerGamingCenter } from "./partnerGamingCenter.validator";

const jwt = require("jsonwebtoken");
const { xss } = require('express-xss-sanitizer');

// Configure multer for file upload
const uploadLogo = multer(sharedMulterOptions).fields([
  { name: 'logoFile', maxCount: 1 }
]);

const registerPartnerGamingCenterLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Bạn đã đăng ký trung tâm game quá số lần cho phép. Vui lòng thử lại sau.",
    });
  },
});
export const registerPartnerGamingCenterController = [
  registerPartnerGamingCenterLimiter,
  uploadLogo,
  xss(),
  ...validateRegisterPartnerGamingCenter,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
  
      let token = extractBearerToken(req);
      let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

      const { 
        gamingCenterName,
        gamingCenterAddress,
        managerName,
        openingHour,
        closingHour,
        machineConfiguration,
        city,
        district,
        fanpage,
        contactPhone,
        email,
        gamingCenterScale,
        averagePlayPrice
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const logoFile = files['logoFile'] ? files['logoFile'][0] : null;
      if (!logoFile) {
        throw new Error("Vui lòng tải lên ảnh logo");
      }

      const partnerGamingCenter = new PartnerGamingCenter();

      partnerGamingCenter.userId = decoded.id;
      partnerGamingCenter.gamingCenterName = gamingCenterName;
      partnerGamingCenter.gamingCenterAddress = gamingCenterAddress;
      partnerGamingCenter.managerName = managerName;
      partnerGamingCenter.openingHour = openingHour;
      partnerGamingCenter.closingHour = closingHour;
      partnerGamingCenter.machineConfiguration = machineConfiguration || null;
      partnerGamingCenter.city = city;
      partnerGamingCenter.district = district;
      partnerGamingCenter.fanpage = fanpage || null;
      partnerGamingCenter.contactPhone = contactPhone;
      partnerGamingCenter.email = email;
      partnerGamingCenter.gamingCenterScale = gamingCenterScale;
      partnerGamingCenter.averagePlayPrice = averagePlayPrice || null;

      // Update logo
      const publicFolderPath = getImageDirPath();
      if (!fs.existsSync(publicFolderPath)) {
        fs.mkdirSync(publicFolderPath, { recursive: true });
      }

      const timestamp = new Date().getTime();

      try {
        // Logo
        const logoFileName = `${decoded.id}_gaming_center_logo_${timestamp}`;
        const logoExtension = path.extname(logoFile.originalname);
        const formattedLogoFilename = `${decoded.id}_gaming_center_logo_${timestamp}${logoExtension}`;
        const clonedLogoFilePath = path.join(publicFolderPath, formattedLogoFilename);
        fs.copyFileSync(logoFile.path, clonedLogoFilePath);
        fs.unlink(logoFile.path, (err) => {
          if (err) {
            console.error('Error deleting the uploaded logo file:', err);
          }
        });

        const logoExt = logoExtension ? logoExtension.slice(1) : 'jpg';
        partnerGamingCenter.logoFile = `/images/${logoFileName}/${logoExt}`;

      } catch (err) {
        throw new Error("error_upload_logo_try_again");
      }

      await partnerGamingCenter.save();
  
      res.status(200).json({
        success: true,
        data: partnerGamingCenter,
      });
    }
  ),
  cleanupTempFilesOnErrorHandler
];

export const getPartnerGamingCenterStatusController = asyncHandler(
  async (req: Request, res: Response) => {

    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const partnerGamingCenter = await PartnerGamingCenter.findOne({ 
      where: { userId: decoded.id }
     });

    if (partnerGamingCenter == null) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: partnerGamingCenter.id,
        gamingCenterName: partnerGamingCenter.gamingCenterName
      },
    });
  }
);

// paging on USER page - get gaming centers of current user only
export const getPagingCurrentUserPartnerGamingCenterController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    let page: number = parseInt((req.query.page as string) || "0");
    let limit: number = parseInt((req.query.limit as string) || "10");
    let sortDesc: boolean = req.query.sortDesc === 'true' ? true : false;
    let searchContent: string | undefined = req.query.searchContent as string;

    if (limit > 10) {
      throw new Error("pageSize/limit must be less than 10");
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const queryBuilder = AppDataSource.getRepository(PartnerGamingCenter)
    .createQueryBuilder("entity")
    .offset(startIndex)
    .where(
      new Brackets((qb) => {
          qb.where("entity.userId = :userId", { userId: decoded.id });
          if (searchContent && searchContent?.length > 0) {
            qb.andWhere(
              new Brackets((subQb) => {
                subQb.where("entity.gamingCenterName ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.gamingCenterAddress ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.city ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.district ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.managerName ILIKE :searchContent", { searchContent: `%${searchContent}%` })
              })
            );
          }
      }),
    )
    .orderBy("entity.id", sortDesc ? "DESC" : "ASC")
    .limit(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const result = {
      total: total,
      page: page,
      pageSize: limit,
      result: data.map(x => {
        return {
          id: x.id,
          gamingCenterName: x.gamingCenterName,
          status: x.status
        }
      }),
      hasNext: endIndex < total,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

// paging on PUBLIC page - get all approved gaming centers with search by province and name
export const getPagingAllPartnerGamingCentersController = asyncHandler(
  async (req: Request, res: Response) => {
    let page: number = parseInt((req.query.page as string) || "1");
    let limit: number = parseInt((req.query.limit as string) || "10");
    let sortDesc: boolean = req.query.sortDesc === 'true' ? true : false;
    let searchName: string | undefined = req.query.searchName as string;
    let province: string | undefined = req.query.province as string;
    if (limit > 10) {
      throw new Error("pageSize/limit must be less than 10");
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const queryBuilder = AppDataSource.getRepository(PartnerGamingCenter)
    .createQueryBuilder("entity")
    .offset(startIndex)
    .where(
      new Brackets((qb) => {
          qb.where("entity.status = :status", { status: PartnerGamingCenterStatus.Approved });
          if (searchName && searchName?.length > 0) {
            qb.andWhere("entity.gamingCenterName ILIKE :searchName", { searchName: `%${searchName}%` });
          }
          if (province && province?.length > 0) {
            qb.andWhere("entity.city = :province", { province });
          }
      }),
    )
    .orderBy("entity.id", sortDesc ? "DESC" : "ASC")
    .limit(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const result = {
      total: total,
      page: page,
      pageSize: limit,
      result: data.map(x => {
        return {
          id: x.id,
          gamingCenterName: x.gamingCenterName,
          gamingCenterAddress: x.gamingCenterAddress,
          city: x.city,
          district: x.district,
          openingHour: x.openingHour,
          closingHour: x.closingHour,
          logoFile: x.logoFile,
        }
      }),
      hasNext: endIndex < total,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

// Get partner gaming center detail by ID (public - no auth required)
export const getPublicPartnerGamingCenterDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    const gamingCenterId = parseInt(req.params.id);
    if (!gamingCenterId || isNaN(gamingCenterId)) {
      throw new Error("ID phòng máy không hợp lệ");
    }

    const item = await PartnerGamingCenter.findOne({
      where: { 
        id: gamingCenterId,
        status: PartnerGamingCenterStatus.Approved
      }
    });

    if (item == null) {
      throw new Error("Không tìm thấy phòng máy");
    }

    res.status(200).json({
      success: true,
      data: {
        id: item.id,
        gamingCenterName: item.gamingCenterName,
        gamingCenterAddress: item.gamingCenterAddress,
        city: item.city,
        district: item.district,
        openingHour: item.openingHour,
        closingHour: item.closingHour,
        logoFile: item.logoFile,
        fanpage: item.fanpage,
        machineConfiguration: item.machineConfiguration,
        averagePlayPrice: item.averagePlayPrice,
      },
    });
  }
);

// Get partner gaming center detail by ID (protected - requires auth and ownership)
export const getPartnerGamingCenterDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const gamingCenterId = parseInt(req.params.id);
    if (!gamingCenterId || isNaN(gamingCenterId)) {
      throw new Error("ID phòng máy không hợp lệ");
    }

    const partnerGamingCenter = await PartnerGamingCenter.findOne({
      where: { 
        id: gamingCenterId,
        userId: decoded.id 
      }
    });

    if (partnerGamingCenter == null) {
      throw new Error("Không tìm thấy phòng máy");
    }

    res.status(200).json({
      success: true,
      data: partnerGamingCenter,
    });
  }
);

// Update partner gaming center by ID
export const updatePartnerGamingCenterController = [
  uploadLogo,
  xss(),
  ...validateUpdatePartnerGamingCenter,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
      let token = extractBearerToken(req);
      let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

      const gamingCenterId = parseInt(req.params.id);
      if (!gamingCenterId || isNaN(gamingCenterId)) {
        throw new Error("ID phòng máy không hợp lệ");
      }

      // Check if gaming center exists and belongs to user
      const existingGamingCenter = await PartnerGamingCenter.findOne({
        where: { 
          id: gamingCenterId,
          userId: decoded.id 
        }
      });

      if (existingGamingCenter == null) {
        throw new Error("Không tìm thấy phòng máy");
      }

      const { 
        gamingCenterName,
        gamingCenterAddress,
        managerName,
        openingHour,
        closingHour,
        machineConfiguration,
        city,
        district,
        fanpage,
        contactPhone,
        email,
        gamingCenterScale,
        averagePlayPrice
      } = req.body;

      // Update fields
      existingGamingCenter.gamingCenterName = gamingCenterName;
      existingGamingCenter.gamingCenterAddress = gamingCenterAddress;
      existingGamingCenter.managerName = managerName;
      existingGamingCenter.openingHour = openingHour;
      existingGamingCenter.closingHour = closingHour;
      existingGamingCenter.machineConfiguration = machineConfiguration || null;
      existingGamingCenter.city = city;
      existingGamingCenter.district = district;
      existingGamingCenter.fanpage = fanpage || null;
      existingGamingCenter.contactPhone = contactPhone;
      existingGamingCenter.email = email;
      existingGamingCenter.gamingCenterScale = gamingCenterScale;
      existingGamingCenter.averagePlayPrice = averagePlayPrice || null;

      // Update logo if new file is uploaded
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const logoFile = files['logoFile'] ? files['logoFile'][0] : null;
      
      if (logoFile) {
        const publicFolderPath = getImageDirPath();
        if (!fs.existsSync(publicFolderPath)) {
          fs.mkdirSync(publicFolderPath, { recursive: true });
        }

        const timestamp = new Date().getTime();

        try {
          // Logo
          const logoFileName = `${decoded.id}_gaming_center_logo_${timestamp}`;
          const logoExtension = path.extname(logoFile.originalname);
          const formattedLogoFilename = `${decoded.id}_gaming_center_logo_${timestamp}${logoExtension}`;
          const clonedLogoFilePath = path.join(publicFolderPath, formattedLogoFilename);
          fs.copyFileSync(logoFile.path, clonedLogoFilePath);
          fs.unlink(logoFile.path, (err) => {
            if (err) {
              console.error('Error deleting the uploaded logo file:', err);
            }
          });

          const logoExt = logoExtension ? logoExtension.slice(1) : 'jpg';
          existingGamingCenter.logoFile = `/images/${logoFileName}/${logoExt}`;
        } catch (err) {
          throw new Error("error_upload_logo_try_again");
        }
      }

      await existingGamingCenter.save();
  
      res.status(200).json({
        success: true,
        data: existingGamingCenter,
      });
    }
  ),
  cleanupTempFilesOnErrorHandler
];

// Admin: Search partner gaming centers with pagination, search by name, filter by status
export const searchPartnerGamingCentersForAdminController = asyncHandler(
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
      PartnerGamingCenter,
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
              subQb.where("entity.gamingCenterName ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.managerName ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.gamingCenterAddress ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.city ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.district ILIKE :searchContent", { searchContent: `%${searchContent}%` });
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

// Admin: Get partner gaming center detail
export const getPartnerGamingCenterDetailForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let id = req.params.id;
    if (!id) {
      throw new Error("bad request");
    }

    let gamingCenter = await PartnerGamingCenter.findOneByOrFail({
      id: +id,
    });

    res.status(200).json({
      success: true,
      data: gamingCenter,
    });
  }
);

// Admin: Approve partner gaming center
export const approvePartnerGamingCenterController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const { gamingCenterId } = req.body;
    if (!gamingCenterId) {
      throw new Error("Gaming Center ID is required");
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const gamingCenterRepository = queryRunner.manager.getRepository(PartnerGamingCenter);
      const gamingCenter = await gamingCenterRepository.findOneBy({ id: gamingCenterId });

      if (gamingCenter == null) {
        throw new Error("Cannot find gaming center.");
      }

      if (gamingCenter.status != PartnerGamingCenterStatus.New) {
        throw new Error("Status is invalid to approve.");
      }

      // Update status to approved
      gamingCenter.status = PartnerGamingCenterStatus.Approved;
      await gamingCenterRepository.save(gamingCenter);

      // [Log]
      const adminLog = new AdminLog();
      adminLog.adminId = decoded.id;
      adminLog.action = `Admin ${decoded.id} approved partner gaming center: #Id ${gamingCenter.id}`;
      await queryRunner.manager.getRepository(AdminLog).save(adminLog);

      // [Notification]
      const notification = new Notification();
      notification.userId = gamingCenter.userId;
      notification.type = NotificationType.SUCCESS;
      notification.title = "Trung tâm game";
      notification.message = `Đơn đăng ký trung tâm game "${gamingCenter.gamingCenterName}" của bạn đã được duyệt.`;
      notification.relatedEntityId = gamingCenter.id;
      notification.relatedEntityType = "PartnerGamingCenter";
      notification.isRead = false;
      await queryRunner.manager.getRepository(Notification).save(notification);

      await queryRunner.commitTransaction();

      res.status(200).json({
        success: true,
        data: gamingCenter,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

// Admin: Reject partner gaming center
export const rejectPartnerGamingCenterController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const { gamingCenterId, rejectionReason } = req.body;
    if (!gamingCenterId) {
      throw new Error("Gaming Center ID is required");
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new Error("Rejection reason is required");
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const gamingCenterRepository = queryRunner.manager.getRepository(PartnerGamingCenter);
      const gamingCenter = await gamingCenterRepository.findOneBy({ id: gamingCenterId });

      if (gamingCenter == null) {
        throw new Error("Cannot find gaming center.");
      }

      if (gamingCenter.status == PartnerGamingCenterStatus.Approved) {
        throw new Error("Status is invalid to reject.");
      }

      gamingCenter.status = PartnerGamingCenterStatus.Rejected;
      gamingCenter.rejectionReason = rejectionReason.trim();
      await gamingCenterRepository.save(gamingCenter);

      // [Log]
      const adminLog = new AdminLog();
      adminLog.adminId = decoded.id;
      adminLog.action = `Admin ${decoded.id} rejected partner gaming center: #Id ${gamingCenter.id} - Reason: ${rejectionReason}`;
      await queryRunner.manager.getRepository(AdminLog).save(adminLog);

      // [Notification]
      const notification = new Notification();
      notification.userId = gamingCenter.userId;
      notification.type = NotificationType.ERROR;
      notification.title = "Trung tâm game";
      notification.message = `Đơn đăng ký trung tâm game "${gamingCenter.gamingCenterName}" của bạn đã bị từ chối. Lý do: ${rejectionReason.trim()}`;
      notification.relatedEntityId = gamingCenter.id;
      notification.relatedEntityType = "PartnerGamingCenter";
      notification.isRead = false;
      await queryRunner.manager.getRepository(Notification).save(notification);

      await queryRunner.commitTransaction();

      res.status(200).json({
        success: true,
        data: gamingCenter,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

