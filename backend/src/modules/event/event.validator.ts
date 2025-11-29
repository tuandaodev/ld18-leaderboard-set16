import { body } from "express-validator";

// Validation rules for create event
export const validateCreateEvent = [
  body('eventName')
    .notEmpty()
    .withMessage('Tên sự kiện là bắt buộc')
    .trim(),
  body('city')
    .notEmpty()
    .withMessage('Thành phố là bắt buộc')
    .trim(),
  body('eventStartTime')
    .notEmpty()
    .withMessage('Thời gian bắt đầu sự kiện là bắt buộc')
    .isISO8601()
    .withMessage('Thời gian bắt đầu sự kiện không hợp lệ')
    .custom((value, { req }) => {
      const startTime = new Date(value);
      const endTime = new Date(req.body.eventEndTime);
      if (startTime >= endTime) {
        throw new Error('Thời gian bắt đầu phải trước thời gian kết thúc');
      }
      return true;
    }),
  body('eventEndTime')
    .notEmpty()
    .withMessage('Thời gian kết thúc sự kiện là bắt buộc')
    .isISO8601()
    .withMessage('Thời gian kết thúc sự kiện không hợp lệ'),
  body('eventType')
    .notEmpty()
    .withMessage('Loại sự kiện là bắt buộc')
    .trim(),
  body('eventDescription')
    .notEmpty()
    .withMessage('Mô tả sự kiện là bắt buộc')
    .trim(),
  body('eventUrl')
    .notEmpty()
    .withMessage('URL sự kiện là bắt buộc')
    .trim()
    .isURL()
    .withMessage('URL sự kiện không hợp lệ'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic phải là giá trị boolean'),
  body('totalPrize')
    .optional()
    .isString()
    .withMessage('Tổng giải thưởng phải là chuỗi')
    .trim(),
];

// Validation rules for update event
export const validateUpdateEvent = [
  body('eventName')
    .notEmpty()
    .withMessage('Tên sự kiện là bắt buộc')
    .trim(),
  body('city')
    .notEmpty()
    .withMessage('Thành phố là bắt buộc')
    .trim(),
  body('eventStartTime')
    .notEmpty()
    .withMessage('Thời gian bắt đầu sự kiện là bắt buộc')
    .isISO8601()
    .withMessage('Thời gian bắt đầu sự kiện không hợp lệ')
    .custom((value, { req }) => {
      const startTime = new Date(value);
      const endTime = new Date(req.body.eventEndTime);
      if (startTime >= endTime) {
        throw new Error('Thời gian bắt đầu phải trước thời gian kết thúc');
      }
      return true;
    }),
  body('eventEndTime')
    .notEmpty()
    .withMessage('Thời gian kết thúc sự kiện là bắt buộc')
    .isISO8601()
    .withMessage('Thời gian kết thúc sự kiện không hợp lệ'),
  body('eventType')
    .notEmpty()
    .withMessage('Loại sự kiện là bắt buộc')
    .trim(),
  body('eventDescription')
    .notEmpty()
    .withMessage('Mô tả sự kiện là bắt buộc')
    .trim(),
  body('eventUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('URL sự kiện không hợp lệ'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic phải là giá trị boolean'),
  body('totalPrize')
    .optional()
    .isString()
    .withMessage('Tổng giải thưởng phải là chuỗi')
    .trim(),
];

