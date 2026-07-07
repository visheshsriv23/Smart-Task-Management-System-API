import { Request, Response, NextFunction } from 'express';
import z from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedBody = await schema.parseAsync(req.body);
      req.body = parsedBody;
      
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          status: 'fail',
          errors: errorMessages,
        });
        return;
      }

      res.status(400).json({ status: 'fail', message: 'Invalid request body formatting' });
    }
  };
};