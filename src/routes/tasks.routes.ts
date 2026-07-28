import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/tasks.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// All task routes require a valid JWT
router.use(authMiddleware);

/**
 * @route  GET /api/tasks/stats
 * @desc   Get task statistics for the authenticated user
 * @access Private
 */
router.get('/stats', getTaskStats);

/**
 * @route  GET /api/tasks
 * @desc   Get all tasks (with optional filters and sort)
 * @access Private
 */
router.get('/', getTasks);

/**
 * @route  POST /api/tasks
 * @desc   Create a new task
 * @access Private
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('dateTime').isISO8601().withMessage('dateTime must be a valid ISO date'),
    body('deadline').isISO8601().withMessage('deadline must be a valid ISO date'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Priority must be one of: low, medium, high, critical'),
    body('category').optional().trim().isLength({ max: 100 }),
    body('tags').optional().isArray(),
  ],
  validate,
  createTask
);

/**
 * @route  GET /api/tasks/:id
 * @desc   Get a single task by ID
 * @access Private
 */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validate,
  getTask
);

/**
 * @route  PATCH /api/tasks/:id
 * @desc   Update a task (partial update)
 * @access Private
 */
router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().trim().notEmpty().isLength({ max: 200 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('dateTime').optional().isISO8601().withMessage('dateTime must be a valid ISO date'),
    body('deadline').optional().isISO8601().withMessage('deadline must be a valid ISO date'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
    body('category').optional().trim(),
    body('tags').optional().isArray(),
    body('isCompleted').optional().isBoolean(),
  ],
  validate,
  updateTask
);

/**
 * @route  DELETE /api/tasks/:id
 * @desc   Delete a task
 * @access Private
 */
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validate,
  deleteTask
);

export default router;
