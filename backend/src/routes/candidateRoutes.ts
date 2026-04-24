import { Router } from 'express';
import { listCandidates, uploadCSVOrJSON, uploadResumePDF } from '../controllers/candidateController';
import { uploadCSVJSON, uploadPDFs } from '../middleware/upload';

const router = Router();

router.get('/', listCandidates);
router.post('/upload', uploadCSVJSON, uploadCSVOrJSON);
router.post('/upload-resume', uploadPDFs, uploadResumePDF);

export default router;
