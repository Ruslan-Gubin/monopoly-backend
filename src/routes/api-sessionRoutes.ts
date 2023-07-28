import expressWs from 'express-ws';
import express from 'express';
import WebSocket from 'ws';
import { handleValidationErrors, handleWebSocket } from "../utils/index.js";
import { sessionHandlers } from '../handlers/index.js';

expressWs(express());
const router =  express.Router() as expressWs.Router;

router.use(handleValidationErrors)
router.ws('/api/ws-session', (ws: WebSocket) => {
  ws.on('message', (msg: string) => handleWebSocket(ws, sessionHandlers, msg));
});

export const sessionRouter = router;
