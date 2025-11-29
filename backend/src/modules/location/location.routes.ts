import { Router } from "express";
import { getProvinceDistrictsController } from "./location.controller";

export const locationRoutes = Router();
locationRoutes.get("/province-districts", getProvinceDistrictsController);

