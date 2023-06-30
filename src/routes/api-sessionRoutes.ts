import expressWs from 'express-ws';
import express from 'express';
import { sessionController } from '../controllers/api-session-controllers.js';
import { handleValidationErrors } from "../utils/index.js";

  
expressWs(express())

const router =  express.Router() as expressWs.Router;

router.use(handleValidationErrors)

router.ws('/api/ws-session', sessionController.wsSession) 

export const sessionRouter = router;