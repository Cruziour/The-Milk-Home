import { Router } from 'express';
import {
  addMilkEntry,
  getMilkEntries,
  getMilkEntriesBySlNo,
  exportMilkEntries,
  updateMilkEntry,
} from '../controllers/milk.controller.js';

const router = Router();

router.route('/add').post(addMilkEntry);
router.route('/get-entries').get(getMilkEntries);
router.route('/get-entries-by-slno').get(getMilkEntriesBySlNo);
router.route('/export').get(exportMilkEntries);
router.route('/update-entry/:entryId').put(updateMilkEntry);

export default router;
