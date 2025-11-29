import { body } from "express-validator";

// Validation rules for create event
export const validateCreateEvent = [
  body('eventName')
    .notEmpty()
    .withMessage('Tên sự kiện là bắt buộc')
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
  body('priority')
    .optional()
    .isInt()
    .withMessage('Priority phải là số nguyên'),
];

// Validation rules for update event
export const validateUpdateEvent = [
  body('eventName')
    .notEmpty()
    .withMessage('Tên sự kiện là bắt buộc')
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
  body('priority')
    .optional()
    .isInt()
    .withMessage('Priority phải là số nguyên'),
];

