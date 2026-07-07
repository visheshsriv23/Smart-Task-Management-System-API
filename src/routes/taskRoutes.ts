import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask, getTaskById, getTaskAnalytics } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js'; 
import { validateRequest } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);
router.route('/analytics')
  .get(getTaskAnalytics);

router.route('/')
  .post(validateRequest(createTaskSchema), createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .patch(validateRequest(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;