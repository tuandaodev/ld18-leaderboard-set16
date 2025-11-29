import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { User, UserRole } from "../../entity/User";
import { buildMailContent, mailTransporter } from "../../mail";
import { asyncHandler, handleValidationErrors } from "../../middleware/async";
import { extractBearerToken } from "../../utils/extractBearerToken";
import { genAC as genAccessToken, genRF as genRefreshToken } from "../../utils/jwt";
import { BaseUserDto } from "../admin/admin.dto";
import { createAdminLog } from "../adminLog/log.service";
import rateLimit from "express-rate-limit";
import { CreateAdminDTO, ForgotPasswordDto, ResetPasswordDto, SignInAdminDTO, SignUpDto, VerifyOTPDTO } from "./auth.dto";
import { validateConfirmForgotPassword, validateForgotPassword, validateSignIn, validateSignUp } from "./auth.validator";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { xss } = require('express-xss-sanitizer');

const handleValidationErrorsHtml = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      const message = firstError.msg || "Đã xảy ra lỗi. Vui lòng thử lại.";
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(400).send(`
        <html>
          <head><meta charset="utf-8" /><title>Lỗi xác nhận đổi mật khẩu</title></head>
          <body style="font-family: Arial, sans-serif;">
            <h3>Không thể đổi mật khẩu</h3>
            <p style="color:#b00020;">${message}</p>
            <p><a href="${process.env.FRONTEND_URL || "/"}">Quay lại trang chủ</a></p>
          </body>
        </html>
      `);
      return;
    }
    next();
  }
);

// Helper function to generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signInRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Bạn đã đăng nhập quá số lần cho phép. Vui lòng thử lại sau.",
    });
  },
});
export const signInController = [
  signInRateLimiter,
  xss(),
  ...validateSignIn,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
      let { username, password, isFromAdminCP } = req.body as SignInAdminDTO;

      username = username?.trim().toLowerCase();

      if (!username || !password) {
        throw new Error("Tên đăng nhập và mật khẩu là bắt buộc.");
      }

      let admin = await User.createQueryBuilder("u")
        .where("u.username = :username", { username })
        .getOne();

      if (!admin) {
        throw new Error("Không tìm thấy tài khoản với thông tin đã cung cấp.");
      }

      if (!(await bcrypt.compare(password, admin.password))) {
        throw new Error("Không tìm thấy tài khoản với thông tin đã cung cấp.");
      }

      // Check if 2FA is enabled for admin users
      if (admin.role === UserRole.ADMIN && admin.isTwoFactorEnabled) {

        if (!isFromAdminCP) {
          throw new Error("Vui lòng truy cập qua trang admin để đăng nhập.");
        }

        // Generate OTP
        const otpCode = generateOTP();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10); // OTP expires in 10 minutes

        // Save OTP to user
        admin.otpCode = otpCode;
        admin.otpExpiresAt = otpExpiresAt;
        await User.save(admin);

        // Send OTP via email
        if (admin.email) {
          try {
            await mailTransporter.sendMail({
              from: process.env.MAIL_SENDER,
              to: admin.email,
              subject: "[Nghịch Thuỷ Hàn] Mã OTP đăng nhập",
              html: buildMailContent(`
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                  <p>Xin chào <strong>${admin.username}</strong>,</p>
                  <p>Mã OTP đăng nhập của bạn là:</p>
                  <h2 style="color: #ec0867; font-size: 32px; letter-spacing: 4px; text-align: center; margin: 20px 0;">
                    ${otpCode}
                  </h2>
                  <p>Mã này sẽ hết hạn sau 10 phút.</p>
                  <p>Nếu bạn không thực hiện đăng nhập, vui lòng bỏ qua email này.</p>
                  <p>Trân trọng,<br>Đội ngũ Nghịch Thuỷ Hàn</p>
                </div>
              `),
            });
          } catch (emailError) {
            console.error("Error sending OTP email:", emailError);
            // Continue even if email fails, but log the error
          }
        }

        // Return response indicating OTP is required
        return res.status(200).json({
          success: 200,
          requiresOTP: true,
          message: "Vui lòng nhập mã OTP đã được gửi đến email của bạn.",
        });
      }

      // Normal login flow (no 2FA or 2FA disabled)
      let baseUserDto = new BaseUserDto();
      baseUserDto.init(admin);

      // Generate refresh token
      let refreshToken = genRefreshToken({ ...baseUserDto });
      admin.refreshToken = refreshToken;
      await User.save(admin);
      
      res.status(200).json({
        success: 200,
        access_token: genAccessToken({ ...baseUserDto }),
        refresh_token: refreshToken,
        role: baseUserDto.role,
        roleString: baseUserDto.role === UserRole.ADMIN ? "ADMIN" : "USER",
      });
    }
  ),
];

const verifyOTPRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Bạn đã đăng nhập quá số lần cho phép. Vui lòng thử lại sau.",
    });
  },
});

export const verifyOTPController = [
  verifyOTPRateLimiter,
  asyncHandler(
  async (req: Request, res: Response) => {
    let { username, otpCode } = req.body as VerifyOTPDTO;

    username = username?.trim().toLowerCase();

    if (!username || !otpCode) {
      throw new Error("Tên đăng nhập và mã OTP là bắt buộc.");
    }

    let admin = await User.createQueryBuilder("u")
      .where("u.username = :username", { username })
      .getOne();

    if (!admin) {
      throw new Error("Không tìm thấy tài khoản với thông tin đã cung cấp.");
    }

    // Check if OTP exists and matches
    if (!admin.otpCode || admin.otpCode !== otpCode) {
      throw new Error("Mã OTP không đúng.");
    }

    // Check if OTP is expired
    if (!admin.otpExpiresAt || new Date() > admin.otpExpiresAt) {
      // Clear expired OTP
      admin.otpCode = null as any;
      admin.otpExpiresAt = null as any;
      await User.save(admin);
      throw new Error("Mã OTP đã hết hạn. Vui lòng đăng nhập lại.");
    }

    // OTP is valid, clear it and generate tokens
    admin.otpCode = null as any;
    admin.otpExpiresAt = null as any;
    await User.save(admin);

    let baseUserDto = new BaseUserDto();
    baseUserDto.init(admin);
    
    res.status(200).json({
      success: 200,
      access_token: genAccessToken({ ...baseUserDto }),
      refresh_token: admin.refreshToken,
      role: baseUserDto.role,
      roleString: baseUserDto.role === UserRole.ADMIN ? "ADMIN" : "USER",
    });
  })
];

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {

    let refreshToken = extractBearerToken(req);
    // Verify refresh token
    let decoded: BaseUserDto = jwt.verify(refreshToken, process.env.RF_PRIVATE_KEY);

    let admin = await User.findOneByOrFail({
      id: decoded.id,
    });

    // Check if refresh token is valid
    if (admin.refreshToken !== refreshToken) {
      throw new Error("Refresh token không hợp lệ.");
    }

    let baseUserDto = new BaseUserDto();
    baseUserDto.init(admin);

    res.status(200).json({
      success: 200,
      access_token: genAccessToken({ ...baseUserDto }),
      refresh_token: admin.refreshToken,
      role: baseUserDto.role,
      roleString: baseUserDto.role === UserRole.ADMIN ? "ADMIN" : "USER",
    });
  }
);

export const registerAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    let { username, email, password, role } = req.body as CreateAdminDTO;

    if (!username || !email || !password || !role) {
      throw new Error("Tên đăng nhập, email, mật khẩu và role là bắt buộc.");
    }

    // Validate username and email are unique
    let existingAdmin = await User.createQueryBuilder("u")
      .where("u.username = :username", { username: username?.trim().toLowerCase() })
      .orWhere("u.email = :email", { email: email?.trim().toLowerCase() })
      .getOne();

    if (existingAdmin) {
      throw new Error("Tên đăng nhập hoặc email đã tồn tại.");
    }

    let admin = new User();
    admin.username = username?.trim().toLowerCase();
    admin.fullname = username;
    admin.email = email?.trim().toLowerCase();
    admin.role = role;
    admin.password = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || "12")
    );

    let createdAdmin = await User.save(admin);

    let adminUser = new BaseUserDto();
    adminUser.init(admin);

    let reqAdmin: BaseUserDto = (req as any).admin;
    await createAdminLog({
      adminId: reqAdmin.id,
      action: `admin ${reqAdmin.id} create new admin: id:${createdAdmin.id} | username:${createdAdmin.username} | role:${createdAdmin.role}`,
    });

    res.status(200).json({
      success: true,
      data: adminUser,
    });
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    let { id, newPassword } = req.body as ResetPasswordDto;

    if (!id || !newPassword) {
      throw new Error("ID và mật khẩu mới là bắt buộc.");
    }

    let admin = await User.findOneByOrFail({
      id: id,
    });

    admin.password = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || "12")
    );

    await User.save(admin);

    res.status(200).json({
      success: true,
    });
  }
);

const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Bạn đã yêu cầu đổi mật khẩu quá số lần cho phép. Vui lòng thử lại sau.",
    });
  },
});

export const forgotPasswordController = [
  forgotPasswordRateLimiter,
  xss(),
  ...validateForgotPassword,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
      const { email, username, newPassword } = req.body as ForgotPasswordDto;

      const user = await User.createQueryBuilder("u")
        .where("u.username = :username", { username: username?.trim().toLowerCase() })
        .andWhere("u.email = :email", { email: email?.trim().toLowerCase() })
        .getOne();

      if (!user) {
        throw new Error("Không tìm thấy tài khoản với thông tin đã cung cấp.");
      }

      // Generate one-time confirmation code and stash new password hash temporarily
      const code = crypto.randomBytes(24).toString("hex");
      const newPasswordHash = await bcrypt.hash(
        newPassword,
        parseInt(process.env.BCRYPT_SALT_ROUNDS || "12")
      );

      user.resetPasswordCode = JSON.stringify({
        code,
        newPasswordHash,
        createdAt: Date.now(),
      }) as any;
      await User.save(user);

      const backendUrl = process.env.BACKEND_URL || "";
      const confirmUrl = `${backendUrl}/auth/confirm-forgot?code=${encodeURIComponent(
        code
      )}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;

      // Send confirmation email
      await mailTransporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: email,
        subject: "[Nghịch Thuỷ Hàn] Xác nhận đổi mật khẩu",
        html: buildMailContent(`
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Xin chào <strong>${username}</strong>,</p>
            <p>Bạn vừa yêu cầu đổi mật khẩu. Vui lòng nhấn vào liên kết dưới đây để xác nhận và hoàn tất đổi mật khẩu:</p>
            <p><a href="${confirmUrl}" target="_blank" rel="noopener">Xác nhận đổi mật khẩu</a></p>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
          </div>
        `),
      });

      res.status(200).json({ success: true });
    }
  ),
];

const confirmForgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Bạn đã xác nhận đổi mật khẩu quá số lần cho phép. Vui lòng thử lại sau.",
    });
  },
});
export const confirmForgotPasswordController = [
  confirmForgotPasswordRateLimiter,
  xss(),
  ...validateConfirmForgotPassword,
  handleValidationErrorsHtml,
  asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const { code, username, email } = req.query as any;

        const user = await User.createQueryBuilder("u")
          .where("u.username = :username", { username: username?.trim().toLowerCase() })
          .andWhere("u.email = :email", { email: email?.trim().toLowerCase() })
          .getOne();

        if (!user || !user.resetPasswordCode) {
          throw new Error("Yêu cầu không hợp lệ hoặc đã hết hạn.");
        }

        let parsed: { code: string; newPasswordHash: string; createdAt?: number };
        try {
          parsed = JSON.parse(user.resetPasswordCode as any);
        } catch {
          throw new Error("Mã xác nhận không hợp lệ.");
        }

        if (!parsed || parsed.code !== code) {
          throw new Error("Mã xác nhận không hợp lệ.");
        }

        // Optional: expire after 24h
        if (parsed.createdAt && Date.now() - parsed.createdAt > 24 * 60 * 60 * 1000) {
          user.resetPasswordCode = null as any;
          await User.save(user);
          throw new Error("Mã xác nhận đã hết hạn.");
        }

        user.password = parsed.newPasswordHash;
        user.resetPasswordCode = null as any;
        await User.save(user);

        const frontendUrl = process.env.FRONTEND_URL || "/";

        // Simple confirmation page
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(200).send(`
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Đổi mật khẩu thành công</title>
              <meta http-equiv="refresh" content="5;url=${frontendUrl}" />
            </head>
            <body style="font-family: Arial, sans-serif;">
              <h3>Đổi mật khẩu thành công</h3>
              <p>Bạn có thể quay lại trang đăng nhập và sử dụng mật khẩu mới.</p>
              <p><a href="${frontendUrl}">Quay lại trang chủ</a></p>
              <p style="color:#555;">Bạn sẽ được chuyển về trang chủ sau 5 giây...</p>
            </body>
          </html>
        `);
      } catch (err: any) {
        const message =
          typeof err?.message === "string" && err.message.trim().length > 0
            ? err.message
            : "Đã xảy ra lỗi. Vui lòng thử lại.";
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(400).send(`
          <html>
            <head><meta charset="utf-8" /><title>Lỗi xác nhận đổi mật khẩu</title></head>
            <body style="font-family: Arial, sans-serif;">
              <h3>Không thể đổi mật khẩu</h3>
              <p style="color:#b00020;">${message}</p>
              <p><a href="${process.env.FRONTEND_URL || "/"}">Quay lại trang chủ</a></p>
            </body>
          </html>
        `);
      }
    }
  ),
];


export const userInfoController = asyncHandler(
  async (req: Request, res: Response) => {
    let token = extractBearerToken(req);

    let decoded: BaseUserDto = jwt.verify(token, process.env.JWT_SECRET);
    let admin = await User.findOneByOrFail({
      id: decoded.id,
    });
    if (admin == null) {
      throw new Error("Account not found");
    }

    let adminDto = new BaseUserDto();
    adminDto.init(admin);

    const profile = {
      email: admin.email,
      socialUrl: admin.socialUrl,
      roleId: admin.roleId,
      uid: admin.uid,
    };

    res.status(200).json({
      success: 200,
      data: profile,
    });
  }
);

const signUpRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Bạn đã đăng ký tài khoản quá số lần cho phép. Vui lòng thử lại sau.",
    });
  },
});

export const signUpController = [
  signUpRateLimiter,
  xss(),
  ...validateSignUp,
  handleValidationErrors,
  asyncHandler(
    async (req: Request, res: Response) => {
      let { username, email, password, roleId, uid, socialUrl, termsAgreedAt } = req.body as SignUpDto;

      username = username?.trim().toLowerCase();
      email = email?.trim().toLowerCase();

      // Check if user already exists
      let existingUser = await User.createQueryBuilder("u")
        .where("u.username = :username OR u.email = :email", { username, email })
        .getOne();

      if (existingUser) {
        throw new Error("Tài khoản đã tồn tại. Vui lòng sử dụng tên đăng nhập hoặc email khác.");
      }

      // Create new user
      let user = new User();
      user.username = username;
      user.email = email;
      user.fullname = username; // Default fullname to username
      user.role = UserRole.USER; // Default role is USER
      user.password = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS || "12")
      );
      
      // Optional fields
      if (roleId) user.roleId = roleId;
      if (uid) user.uid = uid;
      if (socialUrl) user.socialUrl = socialUrl;
      if (termsAgreedAt) user.termsAgreedAt = new Date(termsAgreedAt);

      let createdUser = await User.save(user);
      
      let baseUserDto = new BaseUserDto();
      baseUserDto.init(createdUser);

      // Generate refresh token
      let refreshToken = genRefreshToken({ ...baseUserDto });
      createdUser.refreshToken = refreshToken;
      await User.save(createdUser);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          roleId: createdUser.roleId,
          uid: createdUser.uid,
          socialUrl: createdUser.socialUrl,
        },
        access_token: genAccessToken({ ...baseUserDto }),
        refresh_token: refreshToken,
      });
    }
  ),
];