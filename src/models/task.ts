import { Schema, model, Types } from 'mongoose';

// Schema Pattern for Task
export interface Tasks {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  owner: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

// Task Schema
const taskSchema = new Schema<Tasks>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to an owner'],
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ owner: 1, status: 1 });

export const Task = model<Tasks>('Task', taskSchema);