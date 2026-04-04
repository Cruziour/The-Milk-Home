import { Router } from 'express';
import {
  addMilkEntry,
  getMilkEntries,
  getMilkEntriesBySlNo,
  exportMilkEntries,
  updateMilkEntry,
} from '../controllers/milk.controller.js';
import isAdmin from '../middlewares/admin.middleware.js';
import verifyJwt from '../middlewares/auth.middleware.js';

const router = Router();

// vendors + admin
router.route('/get-entries-by-slno').get(verifyJwt, getMilkEntriesBySlNo);

// only admin
router.route('/add').post(verifyJwt, isAdmin, addMilkEntry);
router.route('/get-entries').get(verifyJwt, isAdmin, getMilkEntries);
router.route('/export').get(verifyJwt, isAdmin, exportMilkEntries);
router.route('/update-entry/:entryId').put(verifyJwt, isAdmin, updateMilkEntry);

export default router;
