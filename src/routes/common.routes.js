import express from 'express';
import commonController from '../controllers/common.controller.js';
import { authenticateUser } from '../middleware/jwtcheck.js';

const router = express.Router();

router.get('/getproperties', commonController.getProperties);
router.post('/sendemail', authenticateUser, commonController.sendEmail)

router.get('/getlikes/:postId', commonController.getLikes)

router.put('/addlike/:postId', authenticateUser, commonController.addLike);
router.delete('/removelike/:postId', authenticateUser, commonController.removeLike)

export default router;