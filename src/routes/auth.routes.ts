import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user
 * @access Public
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  validate,
  register
);

/**
 * @route  POST /api/auth/login
 * @desc   Login with email and password
 * @access Public
 */
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

/**
 * @route  POST /api/auth/refresh
 * @desc   Issue a new access token using a refresh token
 * @access Public
 */
router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  validate,
  refresh
);

/**
 * @route  POST /api/auth/logout
 * @desc   Invalidate refresh token
 * @access Public
 */
router.post('/logout', logout);

export default router;
