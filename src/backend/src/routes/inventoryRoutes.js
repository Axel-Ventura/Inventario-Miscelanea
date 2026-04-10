import express from 'express';
import { listMovements, createMovement } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', listMovements);
router.post('/', createMovement);

export default router;
