const { body, param, query } = require('express-validator');

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const memberValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role').notEmpty().withMessage('Role is required'),
];

const meetingValidation = [
  body('title').trim().notEmpty().withMessage('Meeting title is required'),
  body('scheduledDate').isISO8601().withMessage('Valid date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

const documentValidation = [
  body('title').trim().notEmpty().withMessage('Document title is required'),
  body('type').notEmpty().withMessage('Document type is required'),
];

const surveyValidation = [
  body('title').trim().notEmpty().withMessage('Survey title is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
];

const voteValidation = [
  body('title').trim().notEmpty().withMessage('Vote title is required'),
  body('options').isArray({ min: 2 }).withMessage('At least two options are required'),
];

const decisionValidation = [
  body('title').trim().notEmpty().withMessage('Decision title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
  memberValidation,
  meetingValidation,
  documentValidation,
  surveyValidation,
  voteValidation,
  decisionValidation,
};
