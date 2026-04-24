import { Router } from 'express';
import jobRoutes from './jobRoutes';
import candidateRoutes from './candidateRoutes';
import screeningRoutes from './screeningRoutes';

const router = Router();

router.use('/jobs', jobRoutes);
router.use('/candidates', candidateRoutes);
router.use('/screen', screeningRoutes);
router.use('/results', screeningRoutes); // alias for GET /results/:jobId

export default router;
