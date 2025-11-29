import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { findAllAdminLog } from "./log.service";

export const findAllLogController = asyncHandler(
  async (req: Request, res: Response) => {
    let page: number = parseInt((req.query.page as string) || "0");
    let limit: number = parseInt((req.query.limit as string) || "10");
    let sortDesc: boolean = Boolean((req.query.sortDesc as string) || false);
    let adminId = parseInt(req.query.adminId as string);
    let sortField: string = "id";
    const logs = await findAllAdminLog(
      page,
      limit,
      sortField,
      sortDesc,
      adminId
    );

    res.status(200).json({
      success: true,
      data: logs,
    });
  }
);
