import { Request, Response } from "express";
import { Campaign } from "../../entity/Campaign";
import { asyncHandler } from "../../middleware/async";

export const findAllCampaignController = asyncHandler(
  async (req: Request, res: Response) => {
    let items = await Campaign.find();
    // order items by startDate
    items = items.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    res.status(200).json({
      success: true,
      data: items,
    });
  }
);