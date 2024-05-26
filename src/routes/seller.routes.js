import express from 'express'
import { authenticateUser } from '../middleware/jwtcheck.js';
import sellerController from '../controllers/seller.controller.js';

const router = express.Router();

router.post('/postproperty', authenticateUser, sellerController.addProperty);

router.get('/getproperties', authenticateUser, sellerController.getProprties);

router.put('/updateproperty', authenticateUser, sellerController.updateProperty);

router.delete('/deleteproperty/:postId', authenticateUser, sellerController.deleteProperty)

export default router;