import { Router } from 'express';
import { loginUser, registerVendor, updateUserStatus } from '../controllers/user.controller.js';

const router = Router();

router.route('/').post(registerVendor);
router.route('/update').post(updateUserStatus);
router.route('/login').post(loginUser);

export default router;
