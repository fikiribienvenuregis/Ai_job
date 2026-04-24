import { Router } from 'express';
import { triggerScreening, getResults } from '../controllers/screeningController';

const router = Router();

router.post('/:jobId', triggerScreening);
router.get('/:jobId', getResults);

export default router;
