import express from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/usersController.js';

const router = express.Router();

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
