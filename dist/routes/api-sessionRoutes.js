import express from 'express';
import { sessionController } from '../controllers/api-session-controllers.js';
import { handleValidationErrors } from "../utils/index.js";
import expressWs from 'express-ws';
expressWs(express());
const router = express.Router();
router.use(handleValidationErrors);
router.ws('/api/ws-session', sessionController.wsSession);
export const sessionRouter = router;
