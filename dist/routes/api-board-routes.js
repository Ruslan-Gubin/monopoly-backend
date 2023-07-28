import expressWs from 'express-ws';
import express from 'express';
import { handleValidationErrors, handleWebSocket } from "../utils/index.js";
import { boardHandlers, gameBoardController } from '../handlers/index.js';
expressWs(express());
const router = express.Router();
router.use(handleValidationErrors);
router.get('/api/get-board/:id', gameBoardController.getBoardId);
router.post("/api/create-board", gameBoardController.createBoard);
router.ws('/api/ws-board', (ws) => {
    ws.on('message', (msg) => handleWebSocket(ws, boardHandlers, msg));
});
export const gameBoardRouter = router;
