import expressWs from 'express-ws';
import express from 'express';
import { handleValidationErrors, handleWebSocket } from "../utils/index.js";
import { sessionHandlers } from '../handlers/index.js';
expressWs(express());
const router = express.Router();
router.use(handleValidationErrors);
router.ws('/api/ws-session', (ws) => {
    ws.on('message', (msg) => handleWebSocket(ws, sessionHandlers, msg));
});
export const sessionRouter = router;
