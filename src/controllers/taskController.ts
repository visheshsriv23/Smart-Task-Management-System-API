import mongoose from 'mongoose';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { Task } from '../models/task.js';
import { analyzeTaskWithAI } from '../services/aiService.js';

// Create Task
export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const aiAnalysis = analyzeTaskWithAI(title, description || '');
    const finalPriority = priority || aiAnalysis.suggestedPriority;
    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: finalPriority,
      dueDate,
      owner: req.user!.id,
    }as any);

    res.status(201).json({ status: 'success', data: task, aiEnhancements: {
        aiGeneratedSummary: aiAnalysis.summary,
        aiPriorityReasoning: `Priority auto-evaluated as "${aiAnalysis.suggestedPriority}" based on contextual analysis.`
      }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get All User Tasks
export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const query = req.user?.role === 'admin' ? {} : { owner: req.user!.id };
    const tasks = await Task.find({ owner: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: tasks.length, data: tasks });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update Task
export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, owner: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      res.status(404).json({ status: 'fail', message: 'Task not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: updatedTask });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, owner: req.user!.id });

    if (!deletedTask) {
      res.status(404).json({ status: 'fail', message: 'Task not found' });
      return;
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Single Task by ID
export const getTaskById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const query = req.user?.role === 'admin' ? { _id: id } : { _id: id, owner: req.user!.id };
      const task = await Task.findOne(query);
  
      if (!task) {
        res.status(404).json({ status: 'fail', message: 'Task not found' });
        return;
      }
  
      res.status(200).json({ status: 'success', data: task });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };
  
  // Analytics Module
  export const getTaskAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const stats = await Task.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
          $facet: {
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } }
            ],
            byPriority: [
              { $group: { _id: '$priority', count: { $sum: 1 } } }
            ],
            productivity: [
              {
                $group: {
                  _id: null,
                  totalTasks: { $sum: 1 },
                  completedTasks: {
                    $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
                  }
                }
              }
            ]
          }
        }
      ]);
      const analytics = {
        byStatus: stats[0].byStatus.reduce((acc: any, curr: any) => ({ ...acc, [curr._id]: curr.count }), {}),
        byPriority: stats[0].byPriority.reduce((acc: any, curr: any) => ({ ...acc, [curr._id]: curr.count }), {}),
        summary: stats[0].productivity[0] || { totalTasks: 0, completedTasks: 0 }
      };
  
      res.status(200).json({
        status: 'success',
        data: analytics
      });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };