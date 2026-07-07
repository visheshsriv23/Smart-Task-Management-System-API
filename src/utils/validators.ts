import * as z from 'zod';

//User SChema Validation
export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long'),
    
  email: z.string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
    
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
    
  role: z.enum(['admin', 'user']).optional(),
});

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
    
  password: z.string().min(1, 'Password is required'),
});

// Task Schema Validation
export const createTaskSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Task title is required'),
    
  description: z.string()
    .trim()
    .min(1, 'Task description is required'),
    
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  
  dueDate: z.string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const updateTaskSchema = createTaskSchema.partial();