import { endOfDay, startOfDay } from "date-fns";
import { NextFunction, Request, Response } from "express";
import fs from 'fs';
import multer from "multer";
import path from "path";
import { Brackets, Not } from "typeorm";
import { Campaign } from "../../entity/Campaign";
import { ContentConfig } from "../../entity/ContentConfig";
import { User, UserRole } from "../../entity/User";
import { asyncHandler } from "../../middleware/async";
import { cleanupTempFilesOnErrorHandler } from "../../middleware/cleanup.file.handler";
import { getImageDirPath, sharedMulterOptions } from "../../services/image.service";
import { advancedResult, advancedResultWithRelation } from "../../utils/pagination";
import { createAdminLog } from "../adminLog/log.service";
import { BaseUserDto, UpdateAdminDTO } from "./admin.dto";
import { mailTransporter, buildMailContent } from "../../mail";

export const deleteAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let id = req.params.id;
    if (!id) {
      throw new Error("bad request");
    }

    let admin = await User.findOneByOrFail({
      id: +id,
    });

    await User.delete(admin.id);


    let reqAdmin: BaseUserDto = (req as any).admin;
    await createAdminLog({
      adminId: reqAdmin.id,
      action: `Admin user ${reqAdmin.id} delete admin user ${id}`,
    });

    res.status(200).json({
      success: true,
    });
  }
);

export const toggleTwoFactorAuthController = asyncHandler(
  async (req: Request, res: Response) => {
    let id = req.params.id;
    if (!id) {
      throw new Error("bad request");
    }

    let admin = await User.findOneByOrFail({
      id: +id,
    });

    // Only allow toggling 2FA for admin users
    if (admin.role !== UserRole.ADMIN) {
      throw new Error("Chỉ có thể bật/tắt 2FA cho tài khoản admin");
    }

    // Send email notification
    if (admin.email) {
      const statusText = admin.isTwoFactorEnabled ? "đã được bật" : "đã được tắt";
      const statusTextEn = admin.isTwoFactorEnabled ? "enabled" : "disabled";
      
      try {
        await mailTransporter.sendMail({
          from: process.env.MAIL_SENDER,
          to: admin.email,
          subject: `[Nghịch Thuỷ Hàn] Xác thực 2 yếu tố ${statusText}`,
          html: buildMailContent(`
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <p>Xin chào <strong>${admin.username}</strong>,</p>
              <p>Xác thực 2 yếu tố (2FA) cho tài khoản của bạn ${statusText}.</p>
              <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với quản trị viên ngay lập tức.</p>
              <p>Trân trọng,<br>Đội ngũ Nghịch Thuỷ Hàn</p>
            </div>
          `),
        });
        // Toggle 2FA status
        admin.isTwoFactorEnabled = !admin.isTwoFactorEnabled;
        await User.save(admin);
        
      } catch (emailError) {
        console.error("Error sending 2FA toggle email:", emailError);
        // Continue even if email fails
      }
    }

    let reqAdmin: BaseUserDto = (req as any).admin;
    await createAdminLog({
      adminId: reqAdmin.id,
      action: `Admin user ${reqAdmin.id} ${admin.isTwoFactorEnabled ? 'enabled' : 'disabled'} 2FA for admin user ${id}`,
    });

    res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        isTwoFactorEnabled: admin.isTwoFactorEnabled,
      },
    });
  }
);

export const findAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let id = req.params.id;
    if (!id) {
      throw new Error("bad request");
    }

    let admin = await User.findOneByOrFail({
      id: +id,
    });

    res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        fullname: admin.fullname,
        termsAgreedAt: admin.termsAgreedAt,
        isTwoFactorEnabled: admin.isTwoFactorEnabled,
        role: admin.role,
        email: admin.email,
        username: admin.username,
        profilePhoto: admin.profilePhoto,
        source: admin.source,
        sourceId: admin.sourceId,
        roleId: admin.roleId,
        uid: admin.uid,
        socialUrl: admin.socialUrl,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  }
);

export const findAllAdminController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let page: number = parseInt((req.query.page as string) || "0");
    let limit: number = parseInt((req.query.limit as string) || "10");
    let sortDesc: boolean = Boolean((req.query.sortDesc as string) || false);

    let pageAdmins = await advancedResult(
      User,
      page,
      limit,
      "createdAt",
      sortDesc
    );

    pageAdmins.result = pageAdmins.result.map((ad) => {
      let adminDto = new BaseUserDto();
      adminDto.init(ad);
      return adminDto;
    });

    res.status(200).json({
      success: true,
      data: pageAdmins,
    });
  }
);

export const updateAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let payload: UpdateAdminDTO = req.body;

    let admin = await User.findOneByOrFail({ id: payload.id });

    if (admin.email !== payload.email) {
      admin.email = payload.email;
    }
    if (admin.fullname !== payload.fullname) {
      admin.fullname = payload.fullname;
    }
    if (admin.role !== payload.role) {
      admin.role = payload.role;
    }

    await User.save(admin);

    let reqAdmin: BaseUserDto = (req as any).admin;
    await createAdminLog({
      adminId: reqAdmin.id,
      action: `Admin user ${reqAdmin.id} updated admin user ${payload.id} info: payload ${JSON.stringify(payload)}`,
    });

    res.status(200).json({
      success: true,
      data: new BaseUserDto().init(admin),
    });
  }
);

export const findAllContentController = asyncHandler(
  async (req: Request, res: Response) => {
    let contents = await ContentConfig.find();
    res.status(200).json({
      success: true,
      data: contents,
    });
  }
);

// Configure multer for file upload
const uploadContentFile = multer(sharedMulterOptions).fields([
  { name: 'contentFile', maxCount: 1 },
]);

export const uploadContentController = [
  uploadContentFile,
  asyncHandler(
    async (req: Request, res: Response) => {
      const { contentId, langCode, value } = req.body;
      if (!contentId || !langCode) {
        throw new Error("Please fill in all fields");
      }

      let content = await ContentConfig.findOneByOrFail({
        contentId: contentId,
      });

      let imageUrl = "";
      if (content.valueType == 'image') {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const contentFile = files['contentFile'] ? files['contentFile'][0] : null;
        if (!contentFile) {
          throw new Error("Image must be uploaded");
        }

        try {
          // update avatar
          const publicFolderPath = getImageDirPath();
          if (!fs.existsSync(publicFolderPath)) {
            fs.mkdirSync(publicFolderPath, { recursive: true });
          }
          const timestamp = new Date().getTime();
          const fileName = `${content.contentId}_${timestamp}`;
          const extension = path.extname(contentFile.originalname);
          const formattedFilename = `${content.contentId}_${timestamp}${extension}`;
          const clonedFilePath = path.join(publicFolderPath, formattedFilename);
          fs.copyFileSync(contentFile.path, clonedFilePath);
          fs.unlink(contentFile.path, (err) => {
            if (err) {
              console.error('Error deleting the uploaded file:', err);
            }
          });
          const ext = extension ? extension.slice(1) : 'jpg';
          imageUrl = `/images/${fileName}/${ext}`;
        } catch (err) {
          throw new Error("Error while uploading image");
        }
      } else {
        if (value == undefined || value == null) {
          throw new Error("Please fill in all fields");
        }
      }

      const translate = content.translate.find(e => e.lang === langCode);
      if (!translate) {
        content.translate.push({
          lang: langCode,
          value: value ?? '',
          image: imageUrl ?? ''
        });
      } else {
        translate.value = value;
        translate.image = imageUrl ?? "";
      }
      await content.save();

      res.status(200).json({
        success: true,
        data: content,
      });
    }),
    cleanupTempFilesOnErrorHandler
]

export const addCampaignController = asyncHandler(
  async (req: Request, res: Response) => {
    const { campaignName, startDate, endDate, isActive, isAllowSubmit } = req.body;
    let exist = await Campaign.findOneBy({
      campaignName: campaignName,
    })
    if (exist != null) {
      throw new Error("Campaign already exists");
    }

    // update other isActive = false
    if (isActive) {
      await Campaign.update({
        isActive: true
      }, {
        isActive: false
      })
    }

    let campaign = new Campaign();
    campaign.campaignName = campaignName;
    campaign.startDate = startOfDay(new Date(startDate));
    campaign.endDate = endOfDay(new Date(endDate));
    campaign.isActive = isActive;
    campaign.isAllowSubmit = isAllowSubmit;

    await campaign.save();

    res.status(200).json({
      success: true,
      data: campaign,
    });
  })

export const updateCampaignController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, campaignName, startDate, endDate, isActive, isAllowSubmit } = req.body;
    let campaign = await Campaign.findOneBy({
      id: id,
    })
    if (!campaign) {
      throw new Error("Item not found");
    }

    campaign.campaignName = campaignName;
    campaign.startDate = startOfDay(new Date(startDate));
    campaign.endDate = endOfDay(new Date(endDate));
    campaign.isActive = isActive;
    campaign.isAllowSubmit = isAllowSubmit;

    await campaign.save();

    // update other isActive = false
    if (isActive) {
      await Campaign.update({
        id: Not(id)
      }, {
        isActive: false
      })
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  })

export const searchCampaignsForAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let page: number = parseInt((req.query.page as string) || "0");
    let limit: number = parseInt((req.query.limit as string) || "10");
    let sortDesc: boolean = Boolean((req.query.sortDesc as string) || false);
    let searchContent: string | undefined = req.query.searchContent as string;

    let sortField: string = "id";
    let pagedItems = await advancedResultWithRelation(
      Campaign,
      page,
      limit,
      sortField,
      sortDesc,
      new Brackets((qb) => {
        qb.where("1 = 1");
        if (searchContent && searchContent?.length > 0) {
          qb.andWhere(
            new Brackets((subQb) => {
              subQb.where("entity.campaignName ILIKE :searchContent", { searchContent: `%${searchContent}%` })
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

export const getCampaignDetailForAdminController = asyncHandler(
  async (req: Request, res: Response) => {

    let id = parseInt((req.params.id as string) || "0");
    if (!id) {
      throw new Error("Not found gift item");
    }

    let items = await Campaign.findOneByOrFail({
      id: id
    });
    res.status(200).json({
      success: true,
      data: items,
    });
  }
);

export const getAllCampaignsForAdminController = asyncHandler(
  async (req: Request, res: Response) => {

    let items = await Campaign.find();
    res.status(200).json({
      success: true,
      data: items,
    });
  }
);