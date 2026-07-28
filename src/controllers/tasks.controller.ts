import { Request, Response } from 'express';
import Task from '../models/Task';
import mongoose from 'mongoose';

/**
 * Calculates reminder timestamp based on deadline and notification timing setting.
 */
const calcReminderTime = (deadline: Date | string, timing: string): Date | null => {
  if (!timing || timing === 'none') return null;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return null;
  if (timing === 'at_deadline') return d;
  if (timing === '15m_before') return new Date(d.getTime() - 15 * 60 * 1000);
  if (timing === '1h_before') return new Date(d.getTime() - 60 * 60 * 1000);
  if (timing === '1d_before') return new Date(d.getTime() - 24 * 60 * 60 * 1000);
  return null;
};

/**
 * GET /api/tasks
 * Returns all tasks for the authenticated user.
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { isCompleted, priority, category, tag, sort = 'createdAt', order = 'desc' } = req.query;

    const filter: Record<string, any> = { userId };

    if (isCompleted !== undefined) {
      filter.isCompleted = isCompleted === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }
    if (category) {
      filter.category = category;
    }
    if (tag) {
      filter.tags = { $in: [new RegExp(tag as string, 'i')] };
    }

    const sortFieldMap: Record<string, string> = {
      deadline: 'deadline',
      priority: 'priority',
      dateTime: 'dateTime',
      createdAt: 'createdAt',
      smart: 'deadline',
    };

    const sortField = sortFieldMap[sort as string] ?? 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(filter)
      .sort({ [sortField]: sortOrder })
      .lean();

    res.json({ tasks, count: tasks.length });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/tasks
 * Creates a new task for the authenticated user.
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { title, description, dateTime, deadline, priority, category, tags, reminderTiming = '1h_before' } = req.body;

    const reminderTime = calcReminderTime(deadline, reminderTiming);

    const task = await Task.create({
      userId,
      title,
      description,
      dateTime,
      deadline,
      priority,
      category: category ?? 'General',
      tags: tags ?? [],
      reminderTiming,
      reminderTime,
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/tasks/:id
 */
export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid task ID' });
      return;
    }

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PATCH /api/tasks/:id
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid task ID' });
      return;
    }

    const existingTask = await Task.findOne({ _id: id, userId });
    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const allowedUpdates = ['title', 'description', 'dateTime', 'deadline', 'priority', 'category', 'tags', 'isCompleted', 'reminderTiming'];
    const updates: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.isCompleted === true && !existingTask.isCompleted) {
      updates.completedAt = new Date();
    } else if (updates.isCompleted === false) {
      updates.completedAt = null;
    }

    const finalDeadline = updates.deadline ?? existingTask.deadline;
    const finalTiming = updates.reminderTiming ?? existingTask.reminderTiming;
    updates.reminderTime = calcReminderTime(finalDeadline, finalTiming);

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid task ID' });
      return;
    }

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/tasks/stats
 */
export const getTaskStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.userId);

    const stats = await Task.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$isCompleted', 1, 0] } },
          pending: { $sum: { $cond: ['$isCompleted', 0, 1] } },
          overdue: {
            $sum: {
              $cond: [
                { $and: [{ $lt: ['$deadline', new Date()] }, { $eq: ['$isCompleted', false] }] },
                1,
                0,
              ],
            },
          },
          byPriority: { $push: '$priority' },
        },
      },
    ]);

    if (stats.length === 0) {
      res.json({ total: 0, completed: 0, pending: 0, overdue: 0, byPriority: {} });
      return;
    }

    const result = stats[0];
    const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const p of result.byPriority) {
      byPriority[p] = (byPriority[p] ?? 0) + 1;
    }

    res.json({
      total: result.total,
      completed: result.completed,
      pending: result.pending,
      overdue: result.overdue,
      byPriority,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
