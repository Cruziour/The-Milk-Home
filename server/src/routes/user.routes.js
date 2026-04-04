import { Router } from 'express';
import isAdmin from '../middlewares/admin.middleware.js';
import verifyJwt from '../middlewares/auth.middleware.js';
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
router.route('/').post(verifyJwt, isAdmin, registerVendor);
router.route('/update/:id').put(verifyJwt, isAdmin, updateUserStatus);
router.route('/get-all-users').get(verifyJwt, isAdmin, getAllUsers);
router.route('/get-user/:slNo').get(verifyJwt, isAdmin, getUserBySlNoAndName);

export default router;
