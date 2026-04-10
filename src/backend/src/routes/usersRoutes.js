import express from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/usersController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { requireOwnerOrAdmin } from '../middleware/requireOwnerOrAdmin.js';

const router = express.Router();

router.get('/', requireAdmin, listUsers);
router.post('/', requireAdmin, createUser);
router.get('/:id', requireOwnerOrAdmin, getUser);
router.put('/:id', requireOwnerOrAdmin, updateUser);
router.delete('/:id', requireAdmin, deleteUser);

export default router;
