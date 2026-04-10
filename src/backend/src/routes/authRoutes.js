import express from 'express';
import {
  login,
  register,
  logout,
  logoutAll,
  listSessions,
  revokeSession,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/logout-all', requireAuth, logoutAll);
router.get('/sessions', requireAuth, listSessions);
router.delete('/sessions/:id', requireAuth, revokeSession);

export default router;
