import { body } from "express-validator";
import * as EmailValidator from 'email-validator';

// Validation rules for register leader
export const validateRegisterLeader = [
  body('fullName')
    .notEmpty()
    .withMessage('Vui lòng điền đầy đủ các trường bắt buộc')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Họ tên quá dài'),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Vui lòng điền đầy đủ các trường bắt buộc')
    .custom((value) => {
      const dob = new Date(value);
      if (isNaN(dob.getTime())) {
        throw new Error('Ngày sinh không hợp lệ');
      }
      // Check if user is at least 18 years old
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      if (actualAge < 18) {
        throw new Error('Bạn phải từ 18 tuổi trở lên');
      }
      return true;
    }),
  body('phone')
    .notEmpty()
    .withMessage('Vui lòng điền đầy đủ các trường bắt buộc')
    .trim()
    .custom((value) => {
      if (!/^\d{10,11}$/.test(value)) {
        throw new Error('Số điện thoại không hợp lệ');
      }
      return true;
    }),
  body('email')
    .notEmpty()
    .withMessage('Vui lòng điền đầy đủ các trường bắt buộc')
    .trim()
    .custom((value) => {
      if (!EmailValidator.validate(value) || /[^\u0000-\u007F]/.test(value)) {
        throw new Error('Email không hợp lệ');
      }
      return true;
    })
    .normalizeEmail(),
  body('city')
    .notEmpty()
    .withMessage('Vui lòng điền đầy đủ các trường bắt buộc')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Tên tỉnh/thành quá dài'),
  body('district')
    // .notEmpty()
    // .withMessage('Vui lòng điền đầy đủ các trường bắt buộc')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Tên quận/huyện quá dài'),
  body('facebookLink')
    .notEmpty()
    .withMessage('Vui lòng điền đầy đủ các trường bắt buộc')
    .trim()
    .isURL({
      protocols: ['https'],
      require_protocol: true,
      allow_fragments: true,
      allow_query_components: true,
    })
    .withMessage('Đường dẫn không hợp lệ')
    .custom((value) => {
      let hostname: string;
      try {
        hostname = new URL(value).hostname;
      } catch {
        throw new Error('Đường dẫn Facebook không hợp lệ');
      }
      const allowedHosts = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.com', 'www.fb.com'];
      if (!allowedHosts.includes(hostname)) {
        throw new Error('Đường dẫn Facebook không hợp lệ');
      }
      return true;
    }),
  body('isGuildMaster')
    .notEmpty()
    .withMessage('Vui lòng chọn bạn có phải là bang chủ hay không')
    .custom((value, { req }) => {
      if (value === true || value === false) {
        return true;
      }
      if (value === 'true' || value === 'false') {
        req.body.isGuildMaster = value === 'true';
        return true;
      }
      throw new Error('Giá trị isGuildMaster không hợp lệ');
    }),
  body('guildName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Tên bang quá dài')
    .custom((value, { req }) => {
      const isGuildMaster = req.body.isGuildMaster === true || req.body.isGuildMaster === 'true';
      if (isGuildMaster && (!value || value.trim().length === 0)) {
        throw new Error('Tên bang là bắt buộc khi bạn là bang chủ');
      }
      return true;
    }),
  body('gameCharacterName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Tên nhân vật quá dài'),
  body('gameUID')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('UID quá dài'),
  body('communityGroups')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Thông tin cộng đồng quá dài'),
  body('managementExperience')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Thông tin kinh nghiệm quản lý quá dài'),
  body('eventExperience')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Thông tin kinh nghiệm tổ chức sự kiện quá dài'),
];

