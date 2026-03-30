import { Router } from 'express';
import isAdmin from '../middlewares/admin.middleware.js';
import {
  loginUser,
  registerVendor,
  updateUserStatus,
  getAllUsers,
} from '../controllers/user.controller.js';

const router = Router();

// unsecure routes
router.route('/login').post(loginUser);

// Secure routes
router.route('/').post(isAdmin, registerVendor);
router.route('/update').post(isAdmin, updateUserStatus);
router.route('/getAllUsers').get(isAdmin, getAllUsers);

export default router;
