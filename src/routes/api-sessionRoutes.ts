import expressWs from 'express-ws';
import express from 'express';
import WebSocket from 'ws';
import { handleValidationErrors, handleWebSocketMessage, logger } from "../utils/index.js";

expressWs(express());
const router =  express.Router() as expressWs.Router;

import { sessionHandlers } from '../handlers/index.js';

router.use(handleValidationErrors)
router.ws('/api/ws-session', (ws: WebSocket) => {
  ws.on('message', (msg: string) =>   handleWebSocketMessage(ws, sessionHandlers, msg));
});

export const sessionRouter = router;
