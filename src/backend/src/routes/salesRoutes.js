import express from 'express';
import { listSales, createSale } from '../controllers/salesController.js';

const router = express.Router();

router.get('/', listSales);
router.post('/', createSale);

export default router;
