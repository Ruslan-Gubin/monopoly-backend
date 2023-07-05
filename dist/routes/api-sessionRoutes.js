import expressWs from 'express-ws';
import express from 'express';
import { handleValidationErrors, handleWebSocketMessage } from "../utils/index.js";
expressWs(express());
const router = express.Router();
import { sessionHandlers } from '../handlers/index.js';
router.use(handleValidationErrors);
router.ws('/api/ws-session', (ws) => {
    ws.on('message', (msg) => handleWebSocketMessage(ws, sessionHandlers, msg));
});
export const sessionRouter = router;
