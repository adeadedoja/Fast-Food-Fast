import express from 'express';
import foodController from '../controllers/food';

const router = express.Router();
router.get('/api/v1/food', foodController.getAllfood);
router.post('/api/v1/food', foodController.createFood);
router.put('/api/v1/food/:foodId', foodController.updateFood);


export default router;
