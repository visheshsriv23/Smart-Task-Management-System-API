import type { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.js';
import { generateToken } from '../services/authService.js';

//Register a new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email address.' });
      return;
    }
    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    // JWT Authentication Token Generation
    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully!',
      token,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

//login function
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password credentials.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password credentials.' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully!',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};