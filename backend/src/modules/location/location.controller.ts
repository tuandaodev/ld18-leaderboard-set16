import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import * as fs from "fs";
import * as path from "path";

export const getProvinceDistrictsController = asyncHandler(
  async (req: Request, res: Response) => {
    const filePath = path.join(__dirname, "../../data/province-district.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    res.status(200).json({
      success: true,
      data: jsonData,
    });
  }
);