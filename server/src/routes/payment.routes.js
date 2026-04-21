import { Router } from 'express';
import {
  addPayment,
  getVendorLedger,
  downloadVendorLedger,
} from '../controllers/payment.controller.js';
import isAdmin from '../middlewares/admin.middleware.js';
import verifyJwt from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/get-ledger').get(getVendorLedger);
router.route('/add-payment').post(verifyJwt, isAdmin, addPayment);
router.route('/download-ledger').get(verifyJwt, isAdmin, downloadVendorLedger);

export default router;
