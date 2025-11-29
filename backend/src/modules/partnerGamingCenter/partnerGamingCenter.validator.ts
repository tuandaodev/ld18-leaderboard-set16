import { body } from "express-validator";

// Validation rules for register partner gaming center
export const validateRegisterPartnerGamingCenter = [
  body('gamingCenterName')
    .notEmpty()
    .withMessage('Tên phòng máy là bắt buộc')
    .trim(),
  body('gamingCenterAddress')
    .notEmpty()
    .withMessage('Địa chỉ phòng máy là bắt buộc')
    .trim(),
  body('managerName')
    .notEmpty()
    .withMessage('Tên người quản lý là bắt buộc')
    .trim(),
  body('openingHour')
    .notEmpty()
    .withMessage('Giờ mở cửa là bắt buộc')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Giờ mở cửa không hợp lệ (định dạng: HH:mm)'),
  body('closingHour')
    .notEmpty()
    .withMessage('Giờ đóng cửa là bắt buộc')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Giờ đóng cửa không hợp lệ (định dạng: HH:mm)'),
  body('city')
    .notEmpty()
    .withMessage('Thành phố là bắt buộc')
    .trim(),
  body('district')
    .notEmpty()
    .withMessage('Quận/Huyện là bắt buộc')
    .trim(),
  body('contactPhone')
    .notEmpty()
    .withMessage('Số điện thoại liên hệ là bắt buộc')
    .custom((value) => {
      const phoneRegex = /^[0-9]{10,11}$/;
      const cleanedPhone = value.replace(/[\s-]/g, '');
      if (!phoneRegex.test(cleanedPhone)) {
        throw new Error('Số điện thoại không hợp lệ');
      }
      return true;
    }),
  body('email')
    .notEmpty()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('gamingCenterScale')
    .notEmpty()
    .withMessage('Quy mô phòng máy là bắt buộc')
    .trim(),
  body('machineConfiguration')
    .optional()
    .trim(),
  body('fanpage')
    .optional()
    .trim(),
  body('averagePlayPrice')
    .optional()
    .trim(),
];

// Validation rules for update partner gaming center
export const validateUpdatePartnerGamingCenter = [
  body('gamingCenterName')
    .notEmpty()
    .withMessage('Tên phòng máy là bắt buộc')
    .trim(),
  body('gamingCenterAddress')
    .notEmpty()
    .withMessage('Địa chỉ phòng máy là bắt buộc')
    .trim(),
  body('managerName')
    .notEmpty()
    .withMessage('Tên người quản lý là bắt buộc')
    .trim(),
  body('openingHour')
    .notEmpty()
    .withMessage('Giờ mở cửa là bắt buộc')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Giờ mở cửa không hợp lệ (định dạng: HH:mm)'),
  body('closingHour')
    .notEmpty()
    .withMessage('Giờ đóng cửa là bắt buộc')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Giờ đóng cửa không hợp lệ (định dạng: HH:mm)'),
  body('city')
    .notEmpty()
    .withMessage('Thành phố là bắt buộc')
    .trim(),
  body('district')
    .notEmpty()
    .withMessage('Quận/Huyện là bắt buộc')
    .trim(),
  body('contactPhone')
    .notEmpty()
    .withMessage('Số điện thoại liên hệ là bắt buộc')
    .custom((value) => {
      const phoneRegex = /^[0-9]{10,11}$/;
      const cleanedPhone = value.replace(/[\s-]/g, '');
      if (!phoneRegex.test(cleanedPhone)) {
        throw new Error('Số điện thoại không hợp lệ');
      }
      return true;
    }),
  body('email')
    .notEmpty()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('gamingCenterScale')
    .notEmpty()
    .withMessage('Quy mô phòng máy là bắt buộc')
    .trim(),
  body('machineConfiguration')
    .optional()
    .trim(),
  body('fanpage')
    .optional()
    .trim(),
  body('averagePlayPrice')
    .optional()
    .trim(),
];

