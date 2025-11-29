import { Request, Response } from "express";
import { Not } from "typeorm";
import { ContentConfig } from "../../entity/ContentConfig";
import { asyncHandler } from "../../middleware/async";

export const findAllContentController = asyncHandler(
  async (req: Request, res: Response) => {
    let contents = await ContentConfig.findBy({
      valueType: Not('secret')
    });
    res.status(200).json({
      success: true,
      data: contents,
    });
  }
);