import { body, query } from "express-validator";

export const validateSignIn = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Tên đăng nhập và mật khẩu là bắt buộc.")
    .isString()
    .withMessage("Tên đăng nhập không hợp lệ.")
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Tên đăng nhập và mật khẩu là bắt buộc.")
    .isString()
    .withMessage("Mật khẩu không hợp lệ."),
];

export const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email, tên đăng nhập và mật khẩu mới là bắt buộc.")
    .isEmail()
    .withMessage("Email không hợp lệ.")
    .toLowerCase(),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Email, tên đăng nhập và mật khẩu mới là bắt buộc.")
    .isString()
    .withMessage("Tên đăng nhập không hợp lệ.")
    .toLowerCase(),
  body("newPassword")
    .notEmpty()
    .withMessage("Email, tên đăng nhập và mật khẩu mới là bắt buộc.")
    .isString()
    .withMessage("Mật khẩu mới không hợp lệ."),
];

export const validateConfirmForgotPassword = [
  query("code")
    .notEmpty()
    .withMessage("Mã xác nhận, tên đăng nhập và email là bắt buộc.")
    .isString()
    .withMessage("Mã xác nhận không hợp lệ."),
  query("username")
    .trim()
    .notEmpty()
    .withMessage("Mã xác nhận, tên đăng nhập và email là bắt buộc.")
    .isString()
    .withMessage("Tên đăng nhập không hợp lệ.")
    .toLowerCase(),
  query("email")
    .trim()
    .notEmpty()
    .withMessage("Mã xác nhận, tên đăng nhập và email là bắt buộc.")
    .isEmail()
    .withMessage("Email không hợp lệ.")
    .toLowerCase(),
];

export const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Tên đăng nhập, email và mật khẩu là bắt buộc.")
    .isString()
    .withMessage("Tên đăng nhập không hợp lệ.")
    .toLowerCase(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Tên đăng nhập, email và mật khẩu là bắt buộc.")
    .isEmail()
    .withMessage("Email không hợp lệ.")
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Tên đăng nhập, email và mật khẩu là bắt buộc.")
    .isString()
    .withMessage("Mật khẩu không hợp lệ."),
  body("roleId")
    .optional()
    .matches(/^\d+$/)
    .withMessage("Role ID chỉ được phép là chuỗi số.")
    .trim(),
  body("uid").optional().isString().withMessage("uid không hợp lệ.").trim(),
  body("socialUrl").optional().isString().withMessage("Trang MXH cá nhân không hợp lệ.").trim(),
  body("termsAgreedAt")
    .optional()
    .isISO8601()
    .withMessage("Thời gian đồng ý điều khoản không hợp lệ."),
];

