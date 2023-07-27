import expressWs from 'express-ws';
import express from 'express';
import { handleValidationErrors, handleWebSocketMessage } from "../utils/index.js";
import { sessionHandlers } from '../handlers/index.js';
expressWs(express());
const router = express.Router();
router.use(handleValidationErrors);
router.ws('/api/ws-session', (ws) => {
    ws.on('message', (msg) => handleWebSocketMessage(ws, sessionHandlers, msg));
});
export const sessionRouter = router;
