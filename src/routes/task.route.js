import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import {
  changeTaskStatus,
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from '../controllers/task.controller.js';

const router = Router();

router.get('', authenticateJWT, getTasks);
router.post('/create', authenticateJWT, createTask);
router.put('/update/:taskId', authenticateJWT, updateTask);
router.delete('/delete/:taskId', authenticateJWT, deleteTask);
router.patch('/status/:taskId', authenticateJWT, changeTaskStatus);

export default router;
