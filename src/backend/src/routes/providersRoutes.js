import express from 'express';
import {
  listProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
} from '../controllers/providersController.js';

const router = express.Router();

router.get('/', listProviders);
router.post('/', createProvider);
router.get('/:id', getProvider);
router.put('/:id', updateProvider);
router.delete('/:id', deleteProvider);

export default router;
