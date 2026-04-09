import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/admin.middleware.js';
import {
  deleteArchiveById,
  generateArchive,
  getAllArchives,
  updateArchive,
} from '../controllers/archive.controller.js';

const router = Router();

router.use(verifyJwt, isAdmin);

router.route('/generate').post(generateArchive);
router.route('/update/:archiveId').put(updateArchive);

router.route('/all').get(getAllArchives);

router.route('/delete/:archiveId').delete(deleteArchiveById);

export default router;
