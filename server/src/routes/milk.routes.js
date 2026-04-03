import { Router } from 'express';
import {
  addMilkEntry,
  getMilkEntries,
  getMilkEntriesBySlNo,
  exportMilkEntries,
  updateMilkEntry,
} from '../controllers/milk.controller.js';
import isAdmin from '../middlewares/admin.middleware.js';

const router = Router();

router.route('/add').post(isAdmin, addMilkEntry);
router.route('/get-entries').get(isAdmin, getMilkEntries);
router.route('/get-entries-by-slno').get(getMilkEntriesBySlNo);
router.route('/export').get(isAdmin, exportMilkEntries);
router.route('/update-entry/:entryId').put(isAdmin, updateMilkEntry);

export default router;
