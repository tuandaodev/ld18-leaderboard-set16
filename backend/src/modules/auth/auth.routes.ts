import { Router } from "express";
import { UserRole } from "../../entity/User";
import { protectUserRoute, roleGuard } from "../../middleware/auth";
import {
  confirmForgotPasswordController,
  forgotPasswordController,
  refreshTokenController,
  registerAdminController,
  resetPasswordController,
  signInController,
  signUpController,
  userInfoController,
  verifyOTPController
} from "./auth.controller";

const { xss } = require('express-xss-sanitizer');

export const authRouter = Router();

authRouter.get("/me", protectUserRoute, userInfoController);
// Validate refresh token in controller by RF_PRIVATE_KEY
authRouter.post("/refresh-token", refreshTokenController);

authRouter.post("/register-admin", protectUserRoute, roleGuard(UserRole.ADMIN), xss(), registerAdminController);
authRouter.patch("/reset-password", protectUserRoute, roleGuard(UserRole.ADMIN), xss(), resetPasswordController);

authRouter.post("/sign-in", signInController);
authRouter.post("/sign-up", signUpController);
authRouter.post("/verify-otp", xss(), verifyOTPController);

authRouter.post("/forgot-password", forgotPasswordController);
authRouter.get("/confirm-forgot", confirmForgotPasswordController);