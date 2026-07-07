import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/')
  .get(authorize('admin'), getAllUsers);

export default router;