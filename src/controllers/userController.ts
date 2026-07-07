import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { User } from '../models/user.js';

//Get User Profile
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

//Update User Profile
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Admin Access 
export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };