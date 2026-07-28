import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware that checks express-validator results.
 * If there are validation errors, returns 400 with a structured error list.
 * Otherwise calls next() to proceed to the controller.
 */
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : 'general',
        message: err.msg,
      })),
    });
    return;
  }
  next();
};
