import { Router } from 'express';
import {
  addMilkEntry,
  getMilkEntries,
  getMilkEntriesBySlNo,
  exportMilkEntries,
} from '../controllers/milk.controller.js';

const router = Router();

router.route('/add').post(addMilkEntry);
router.route('/get-entries').get(getMilkEntries);
router.route('/get-entries-by-slno').get(getMilkEntriesBySlNo);
router.route('/export').get(exportMilkEntries);

export default router;
