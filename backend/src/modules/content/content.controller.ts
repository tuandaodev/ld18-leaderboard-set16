import { Request, Response } from "express";
import { ContentConfig } from "../../entity/ContentConfig";
import { asyncHandler } from "../../middleware/async";

export const findAllContentController = asyncHandler(
  async (req: Request, res: Response) => {
    let contents = await ContentConfig.findBy({
      isPublic: true
    });
    res.status(200).json({
      success: true,
      data: contents.map(x => ({
        contentId: x.contentId,
        description: x.description,
        valueType: x.valueType,
        translate: x.translate
      })),
    });
  }
);