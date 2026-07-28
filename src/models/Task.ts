import mongoose, { Document, Schema } from 'mongoose';

/**
 * Priority levels for tasks — used in sorting and color coding on the frontend.
 */
export type Priority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Notification timing options before deadline.
 */
export type ReminderTiming = 'none' | 'at_deadline' | '15m_before' | '1h_before' | '1d_before';

/**
 * Interface for the Task document.
 */
export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dateTime: Date;       // Scheduled start time for the task
  deadline: Date;       // Hard deadline / due date
  priority: Priority;
  category: string;
  tags: string[];
  reminderTiming: ReminderTiming;
  reminderTime: Date | null;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Scheduled date/time is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    reminderTiming: {
      type: String,
      enum: ['none', 'at_deadline', '15m_before', '1h_before', '1d_before'],
      default: '1h_before',
    },
    reminderTime: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ userId: 1, isCompleted: 1, deadline: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ userId: 1, category: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
