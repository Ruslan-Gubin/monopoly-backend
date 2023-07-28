import { GameBoardController, PlayerController, DiceController, CellController } from '../controllers/index.js';
import { GameBoardService, PlayerService, DiceService, CellService } from '../service/index.js';
import { HandlersType } from '../types/index.js';
import { nodeCache } from '../utils/index.js';
import { authController } from './session-handlers.js';

export const gameBoardService = new GameBoardService({ cache: nodeCache })   
export const playerService = new PlayerService({ cache: nodeCache }) 
export const diceService = new DiceService({ cache: nodeCache })
export const cellService = new CellService({ cache: nodeCache }) 


export const cellController = new CellController(cellService)
export const gameBoardController = new GameBoardController(gameBoardService) 
export const playerController = new PlayerController(playerService)
export const diceController = new DiceController(diceService)



export const boardHandlers: HandlersType = { 
  connection: [gameBoardController.handleMessage, authController.handleMessage],
  // createSession: [sessionController.handleMessage],
  // removeSession: [sessionController.handleMessage],
  // joinSession: [sessionController.handleMessage],
  // outSession: [sessionController.handleMessage],
  // disconect: [sessionController.handleMessage, authController.handleMessage],
  // createMessage: [messageController.handleMessage],
  // sessionStartConfirmation: [confirmationController.handleMessage],
  // confirmParticipationGame: [confirmationController.handleMessage],
  // cancelParticipationGame: [confirmationController.handleMessage],
};