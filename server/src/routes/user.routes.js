import { Router } from 'express';
import isAdmin from '../middlewares/admin.middleware.js';
import {
  loginUser,
  registerVendor,
  updateUserStatus,
  getAllUsers,
  getUserBySlNoAndName,
} from '../controllers/user.controller.js';

const router = Router();

// unsecure routes
router.route('/login').post(loginUser);

// Secure routes
router.route('/').post(isAdmin, registerVendor);
router.route('/update/:id').put(isAdmin, updateUserStatus);
router.route('/get-all-users').get(isAdmin, getAllUsers);
router.route('/get-user/:slNo').get(isAdmin, getUserBySlNoAndName);

export default router;
