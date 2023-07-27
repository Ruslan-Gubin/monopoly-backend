import expressWs from 'express-ws';
import express from 'express';
import WebSocket from 'ws';
import { handleValidationErrors, handleWebSocketMessage, nodeCache } from "../utils/index.js";
import { sessionHandlers } from '../handlers/index.js';
import { DiceController, GameBoardController } from '../controllers/index.js';
import { GameBoardService, PlayerService, DiceService } from '../service/index.js';
import { PlayerController } from '../controllers/api-player-controllers.js';


expressWs(express());
const router = express.Router() as expressWs.Router;

const gameBoardService = new GameBoardService({ cache: nodeCache })   
const gameBoardController = new GameBoardController(gameBoardService) 
export const playerService = new PlayerService({ cache: nodeCache }) 
export const playerController = new PlayerController(playerService)
export const diceService = new DiceService({ cache: nodeCache })
export const diceController = new DiceController(diceService)

router.use(handleValidationErrors)

router.get('/api/get-board/:id', gameBoardController.getBoardId)
router.post("/api/create-board", gameBoardController.createBoard);

router.ws('/api/ws-board', (ws: WebSocket) => {
  // ws.on('message', (msg) => console.log(msg))
  // ws.on('message', (msg: string) =>   handleWebSocketMessage(ws, sessionHandlers, msg));
});

export const gameBoardRouter = router;