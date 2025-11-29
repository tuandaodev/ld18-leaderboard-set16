import { body } from "express-validator";

const forbidAngleBrackets = (fieldLabel: string) => (value: string) => {
  if (typeof value === "string" && /<|>/.test(value)) {
    throw new Error(`${fieldLabel} không được chứa ký tự < hoặc >`);
  }
  return true;
};

// Validation rules for register event
export const validateRegisterEvent = [
  body('eventName')
    .notEmpty()
    .withMessage('Tên sự kiện là bắt buộc')
    .isLength({ min: 5, max: 200 })
    .withMessage('Tên sự kiện phải từ 5-200 ký tự')
    .trim()
    .custom(forbidAngleBrackets('Tên sự kiện')),
  body('city')
    .notEmpty()
    .withMessage('Thành phố là bắt buộc')
    .trim()
    .custom(forbidAngleBrackets('Thành phố')),
  body('district')
    .notEmpty()
    .withMessage('Quận/Huyện là bắt buộc')
    .trim()
    .custom(forbidAngleBrackets('Quận/Huyện')),
  body('registrationDeadline')
    .notEmpty()
    .withMessage('Hạn đăng ký là bắt buộc')
    .isISO8601()
    .withMessage('Ngày hết hạn đăng ký không hợp lệ'),
  body('eventStartTime')
    .notEmpty()
    .withMessage('Thời gian bắt đầu sự kiện là bắt buộc')
    .isISO8601()
    .withMessage('Thời gian bắt đầu sự kiện không hợp lệ'),
  body('eventEndTime')
    .notEmpty()
    .withMessage('Thời gian kết thúc sự kiện là bắt buộc')
    .isISO8601()
    .withMessage('Thời gian kết thúc sự kiện không hợp lệ'),
  body('venueAddress')
    .notEmpty()
    .withMessage('Địa chỉ địa điểm là bắt buộc')
    .isLength({ max: 500 })
    .withMessage('Địa chỉ không được vượt quá 500 ký tự')
    .trim()
    .custom(forbidAngleBrackets('Địa chỉ địa điểm')),
  body('venueName')
    .notEmpty()
    .withMessage('Tên địa điểm là bắt buộc')
    .isLength({ max: 200 })
    .withMessage('Tên địa điểm không được vượt quá 200 ký tự')
    .trim()
    .custom(forbidAngleBrackets('Tên địa điểm')),
  body('eventType')
    .notEmpty()
    .withMessage('Loại sự kiện là bắt buộc')
    .trim()
    .custom(forbidAngleBrackets('Loại sự kiện')),
  body('deviceType')
    .optional()
    .trim()
    .custom(forbidAngleBrackets('Loại thiết bị')),
  body('eventDescription')
    .notEmpty()
    .withMessage('Mô tả sự kiện là bắt buộc')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Mô tả sự kiện phải từ 50-2000 ký tự')
    .trim()
    .custom(forbidAngleBrackets('Mô tả sự kiện')),
  body('eventScale')
    .notEmpty()
    .withMessage('Quy mô sự kiện là bắt buộc')
    .matches(/^[0-9]+$/)
    .withMessage('Quy mô sự kiện phải là số hợp lệ')
    .custom(value => {
      const numericValue = Number(value);
      if (Number.isNaN(numericValue) || numericValue <= 0) {
        throw new Error('Quy mô sự kiện phải lớn hơn 0');
      }
      return true;
    }),
  body('supportLevel')
    .notEmpty()
    .withMessage('Mức hỗ trợ là bắt buộc')
    .isLength({ max: 500 })
    .withMessage('Mức hỗ trợ không được vượt quá 500 ký tự')
    .trim()
    .custom(forbidAngleBrackets('Mức hỗ trợ')),
];