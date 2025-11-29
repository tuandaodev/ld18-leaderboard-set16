import { Request, Response } from "express";
import fs from 'fs';
import multer from "multer";
import path from "path";
// @ts-ignore - json2csv doesn't have type definitions
import removeAccents from 'remove-accents';
import { Brackets, In } from 'typeorm';
import rateLimit from "express-rate-limit";
// @ts-ignore - json2csv doesn't have type definitions
import { parse } from 'json2csv';
import { AppDataSource } from "../../data-source";
import { AdminLog } from "../../entity/AdminLog";
import { Leader, LeaderStatus } from "../../entity/Leader";
import { Notification, NotificationType } from "../../entity/Notification";
import { asyncHandler, handleValidationErrors } from "../../middleware/async";
import { cleanupTempFilesOnErrorHandler } from "../../middleware/cleanup.file.handler";
import { getImageDirPath, sharedMulterOptions } from '../../services/image.service';
import { extractBearerToken } from "../../utils/extractBearerToken";
import { advancedResult } from "../../utils/pagination";
import { BaseUserDto } from "../admin/admin.dto";
import { createAdminLog } from "../adminLog/log.service";
import { validateRegisterLeader } from "./leader.validator";

const jwt = require("jsonwebtoken");
const { xss } = require('express-xss-sanitizer');

// Configure multer for file upload
const uploadAvatar = multer(sharedMulterOptions).fields([
  { name: 'avatarFile', maxCount: 1 }
]);

const registerLeaderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Bạn đã đăng ký thủ lĩnh cộng đồng quá số lần cho phép. Vui lòng thử lại sau.",
    });
  },
});

export const registerLeaderController = [
  registerLeaderLimiter,
  uploadAvatar,
  xss(),
  ...validateRegisterLeader,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
  
      let token = extractBearerToken(req);
      let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

      const { 
        fullName, 
        dateOfBirth, 
        phone, 
        email, 
        city, 
        district, 
        facebookLink, 
        gameCharacterName, 
        gameUID, 
        communityGroups, 
        isGuildMaster, 
        guildName, 
        managementExperience, 
        eventExperience 
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const avatarFile = files['avatarFile'] ? files['avatarFile'][0] : null;
      if (!avatarFile) {
        throw new Error("Vui lòng tải lên ảnh đại diện");
      }

      // Check if email already exists
      const leaderEmailExists = await Leader.findOneBy({ email: email?.toLowerCase(), status: In([LeaderStatus.New, LeaderStatus.Approved]) });
      if (leaderEmailExists != null) {
        throw new Error("Email đã được đăng ký");
      }

      // Check if phone already exists
      const leaderPhoneExists = await Leader.findOneBy({ phone: phone, status: In([LeaderStatus.New, LeaderStatus.Approved]) });
      if (leaderPhoneExists != null) {
        throw new Error("Số điện thoại đã được đăng ký");
      }

      // Validate date of birth (already validated in middleware, but need to convert to Date)
      const dob = new Date(dateOfBirth);

      // Check if user is already a leader
      const leaderExists = await Leader.findOneBy({ userId: decoded.id, status: In([LeaderStatus.New, LeaderStatus.Approved]) });
      if (leaderExists != null) {
        if (leaderExists.status == LeaderStatus.New) {
          throw new Error("Bạn đã đăng ký thành thủ lĩnh cộng đồng trước đó. Vui lòng chờ để được xét duyệt.");
        }
        throw new Error("Bạn đã đăng ký thành thủ lĩnh cộng đồng rồi. Vui lòng không đăng ký lại.");
      }
  
      const leader = new Leader();
      leader.userId = decoded.id;
      leader.fullName = fullName;
      leader.unsignedFullName = removeAccents(fullName);
      leader.email = email?.toLowerCase();
      leader.phone = phone;
      leader.dateOfBirth = dob;
      leader.city = city;
      if (district) {
        leader.district = district;
      }
      leader.facebookLink = facebookLink;
      leader.gameCharacterName = gameCharacterName || null;
      leader.gameUID = gameUID || null;
      leader.communityGroups = communityGroups || null;
      leader.isGuildMaster = isGuildMaster === 'true' || isGuildMaster === true;
      leader.guildName = (isGuildMaster === 'true' || isGuildMaster === true) ? guildName : null;
      leader.managementExperience = managementExperience || null;
      leader.eventExperience = eventExperience || null;
      leader.status = LeaderStatus.New;

      // Update avatar
      const publicFolderPath = getImageDirPath();
      if (!fs.existsSync(publicFolderPath)) {
        fs.mkdirSync(publicFolderPath, { recursive: true });
      }

      const timestamp = new Date().getTime();

      try {
        // Avatar
        const avatarFileName = `${decoded.id}_leader_avatar_${timestamp}`;
        const avatarExtension = path.extname(avatarFile.originalname);
        const formattedAvatarFilename = `${decoded.id}_leader_avatar_${timestamp}${avatarExtension}`;
        const clonedAvatarFilePath = path.join(publicFolderPath, formattedAvatarFilename);
        fs.copyFileSync(avatarFile.path, clonedAvatarFilePath);
        fs.unlink(avatarFile.path, (err) => {
          if (err) {
            console.error('Error deleting the uploaded avatar file:', err);
          }
        });

        const avatarext = avatarExtension ? avatarExtension.slice(1) : 'jpg';
        leader.avatar = `/images/${avatarFileName}/${avatarext}`;

      } catch (err) {
        throw new Error("error_upload_avatar_try_again");
      }

      await leader.save();
  
      res.status(200).json({
        success: true,
        data: leader,
      });
    }
  ),
  cleanupTempFilesOnErrorHandler
];

// ONLY FOR CURRENT USER
export const getLeaderStatusController = asyncHandler(
  async (req: Request, res: Response) => {

    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const leader = await Leader.findOne({ 
      where: { userId: decoded.id, status: In([LeaderStatus.Approved]) }
     });

    if (leader == null) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: leader.id,
        fullName: leader.fullName,
        email: leader.email,
        phone: leader.phone,
        dateOfBirth: leader.dateOfBirth,
        city: leader.city,
        district: leader.district,
        facebookLink: leader.facebookLink,
        gameCharacterName: leader.gameCharacterName,
        gameUID: leader.gameUID,
        communityGroups: leader.communityGroups,
        isGuildMaster: leader.isGuildMaster,
        guildName: leader.guildName,
        managementExperience: leader.managementExperience,
        eventExperience: leader.eventExperience,
        avatar: leader.avatar,
        status: leader.status,
      },
    });
  }
);

// Admin: Search leaders with pagination, search by name, filter by status
export const searchLeadersForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let page: number = parseInt((req.query.page as string) || "1");
    let pageSize: string | undefined = req.query.pageSize as string;
    let limitStr: string | undefined = req.query.limit as string;
    let limit: number = pageSize ? parseInt(pageSize) : (limitStr ? parseInt(limitStr) : 10);
    let sortDesc: boolean = Boolean((req.query.sortDesc as string) || false);
    let searchContent: string | undefined = req.query.searchContent as string;
    let status: number | undefined = req.query.status !== undefined ? parseInt(req.query.status as string) : undefined;
    if (limit > 10) {
      throw new Error("pageSize/limit must be less than 10");
    }

    let sortField: string = "id";
    let pagedItems = await advancedResult(
      Leader,
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
              subQb.where("entity.fullName ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.unsignedFullName ILIKE :searchContent", { searchContent: `%${searchContent}%` })
                .orWhere("entity.userId IN (SELECT \"user\".id FROM \"user\" WHERE \"user\".username = :exactUsername)", { exactUsername: searchContent?.toLowerCase() });
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

// Admin: Get leader detail
export const getLeaderDetailForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let id = req.params.id;
    if (!id) {
      throw new Error("bad request");
    }

    let leader = await Leader.findOneByOrFail({
      id: +id,
    });

    res.status(200).json({
      success: true,
      data: leader,
    });
  }
);

// Admin: Approve leader and update totalPoint
export const approveLeaderController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const { leaderId } = req.body;
    if (!leaderId) {
      throw new Error("Leader ID is required");
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const leaderRepository = queryRunner.manager.getRepository(Leader);
      const leader = await leaderRepository.findOneBy({ id: leaderId });
      
      if (leader == null) {
        throw new Error("Cannot find leader.");
      }

      if (leader.status != LeaderStatus.New) {
        throw new Error("Status is invalid to approve.");
      }

      // Update status to approved
      leader.status = LeaderStatus.Approved;
      
      // Initialize totalPoint if null (set to 0)
      if (leader.totalPoint == null) {
        leader.totalPoint = 0;
      }

      await leaderRepository.save(leader);

      // [Log]
      const adminLog = new AdminLog();
      adminLog.adminId = decoded.id;
      adminLog.action = `Admin ${decoded.id} approved leader: #Id ${leader.id}`;
      await queryRunner.manager.getRepository(AdminLog).save(adminLog);

      // [Notification]
      const notification = new Notification();
      notification.userId = leader.userId;
      notification.type = NotificationType.SUCCESS;
      notification.title = "Thủ lĩnh cộng đồng";
      notification.message = `Đơn đăng ký thủ lĩnh cộng đồng của bạn đã được duyệt.`;
      notification.relatedEntityId = leader.id;
      notification.relatedEntityType = "Leader";
      notification.isRead = false;
      await queryRunner.manager.getRepository(Notification).save(notification);

      await queryRunner.commitTransaction();

      res.status(200).json({
        success: true,
        data: leader,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

// Admin: Reject leader
export const rejectLeaderController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const { leaderId, rejectionReason } = req.body;
    if (!leaderId) {
      throw new Error("Leader ID is required");
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new Error("Rejection reason is required");
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const leaderRepository = queryRunner.manager.getRepository(Leader);
      const leader = await leaderRepository.findOneBy({ id: leaderId });

      if (leader == null) {
        throw new Error("Cannot find leader.");
      }

      if (leader.status == LeaderStatus.Approved) {
        throw new Error("Status is invalid to reject.");
      }

      leader.status = LeaderStatus.Rejected;
      leader.rejectionReason = rejectionReason.trim();
      await leaderRepository.save(leader);

      // [Log]
      const adminLog = new AdminLog();
      adminLog.adminId = decoded.id;
      adminLog.action = `Admin ${decoded.id} rejected leader: #Id ${leader.id} - Reason: ${rejectionReason}`;
      await queryRunner.manager.getRepository(AdminLog).save(adminLog);

      // [Notification]
      const notification = new Notification();
      notification.userId = leader.userId;
      notification.type = NotificationType.ERROR;
      notification.title = "Thủ lĩnh cộng đồng";
      notification.message = `Đơn đăng ký thủ lĩnh cộng đồng của bạn đã bị từ chối. Lý do: ${rejectionReason.trim()}`;
      notification.relatedEntityId = leader.id;
      notification.relatedEntityType = "Leader";
      notification.isRead = false;
      await queryRunner.manager.getRepository(Notification).save(notification);

      await queryRunner.commitTransaction();

      res.status(200).json({
        success: true,
        data: leader,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

// Admin: Update leader totalPoint
export const updateLeaderTotalPointController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);
    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);

    const { leaderId, totalPoint } = req.body;
    if (!leaderId || totalPoint === undefined || totalPoint === null) {
      throw new Error("Leader ID and totalPoint are required");
    }

    const leader = await Leader.findOneBy({ id: leaderId });

    if (leader == null) {
      throw new Error("Cannot find leader.");
    }

    if (leader.status != LeaderStatus.Approved) {
      throw new Error("Can only update totalPoint for approved leaders.");
    }

    // Validate totalPoint is a number
    const pointValue = parseInt(totalPoint);
    if (isNaN(pointValue) || pointValue < 0) {
      throw new Error("TotalPoint must be a non-negative number.");
    }

    leader.totalPoint = pointValue;
    await leader.save();

    // [Log]
    await createAdminLog({
      adminId: decoded.id,
      action: `Admin ${decoded.id} updated leader totalPoint: #Id ${leader.id} to ${pointValue}`,
    });

    res.status(200).json({
      success: true,
      data: leader,
    });
  }
);

// Public: Get all approved leaders (id, avatar, fullName)
export const getAllLeadersController = asyncHandler(
  async (req: Request, res: Response) => {
    const leaders = await Leader.find({
      where: { status: LeaderStatus.Approved },
      select: ['id', 'avatar', 'fullName'],
      order: { totalPoint: 'DESC' },
    });

    res.status(200).json({
      success: true,
      data: leaders,
    });
  }
);

// Public: Get top 16 leaders sorted by totalPoint (id, fullName, avatar, totalPoint)
export const getLeaderboardController = asyncHandler(
  async (req: Request, res: Response) => {
    const leaders = await Leader.find({
      where: { status: LeaderStatus.Approved },
      select: ['id', 'fullName', 'avatar', 'totalPoint'],
      order: { totalPoint: 'DESC' },
      take: 16,
    });

    res.status(200).json({
      success: true,
      data: leaders,
    });
  }
);

// Admin: Export top 16 leaders sorted by totalPoint to CSV
export const exportLeaderboardToCSVController = asyncHandler(
  async (req: Request, res: Response) => {
    const leaders = await Leader.find({
      where: { status: LeaderStatus.Approved },
      order: { totalPoint: 'DESC' },
      take: 16,
    });

    // Add rank and format data for CSV
    const leadersWithRank = leaders.map((leader, index) => ({
      rank: index + 1,
      id: leader.id,
      userId: leader.userId,
      fullName: leader.fullName,
      email: leader.email,
      phone: leader.phone,
      dateOfBirth: leader.dateOfBirth,
      city: leader.city,
      district: leader.district,
      facebookLink: leader.facebookLink,
      gameCharacterName: leader.gameCharacterName || '',
      gameUID: leader.gameUID || '',
      communityGroups: leader.communityGroups || '',
      isGuildMaster: leader.isGuildMaster ? 'Yes' : 'No',
      guildName: leader.guildName || '',
      managementExperience: leader.managementExperience || '',
      eventExperience: leader.eventExperience || '',
      totalPoint: leader.totalPoint ?? 0
    }));

    // Define CSV fields
    const fields = [
      { label: 'Rank', value: 'rank' },
      { label: 'User ID', value: 'userId' },
      { label: 'Full Name', value: 'fullName' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Date of Birth', value: 'dateOfBirth' },
      { label: 'City', value: 'city' },
      { label: 'District', value: 'district' },
      { label: 'Facebook Link', value: 'facebookLink' },
      { label: 'Game Character Name', value: 'gameCharacterName' },
      { label: 'Game UID', value: 'gameUID' },
      { label: 'Community Groups', value: 'communityGroups' },
      { label: 'Guild Name', value: 'guildName' },
      { label: 'Total Point', value: 'totalPoint' }
    ];

    try {
      // Convert to CSV
      const csv = parse(leadersWithRank, { fields });

      // Set headers for CSV download
      const filename = `leaderboard_top_16_${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Add BOM for Excel compatibility
      const BOM = '\uFEFF';
      res.send(BOM + csv);
    } catch (error) {
      throw new Error("Failed to generate CSV file");
    }
  }
);

// Public: Get leader detail by id (id, fullName, avatar, totalPoint, facebookLink)
export const getLeaderDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      throw new Error("Leader ID is required");
    }

    const leader = await Leader.findOne({
      where: { id: +id, status: LeaderStatus.Approved },
      select: ['id', 'fullName', 'avatar', 'totalPoint', 'facebookLink'],
    });

    if (!leader) {
      throw new Error("Leader not found");
    }

    res.status(200).json({
      success: true,
      data: leader,
    });
  }
);