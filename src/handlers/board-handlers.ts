import { GameBoardController, PlayerController, DiceController, CellController, MoveController, PropertyActionController, AuctionController } from '../controllers/index.js';
import { GameBoardService, PlayerService, DiceService, CellService, PropertyService, MoveService, PropertyActionService, AuctionService } from '../service/index.js';
import { HandlersType } from '../types/index.js';
import { nodeCache } from '../utils/index.js';
import { authController } from './session-handlers.js'; 
  
export const gameBoardService = new GameBoardService({ cache: nodeCache })   
export const playerService = new PlayerService({ cache: nodeCache })
export const diceService = new DiceService({ cache: nodeCache })
export const cellService = new CellService({ cache: nodeCache })
export const propertyService = new PropertyService({ cache: nodeCache })
export const moveService = new MoveService({ cache: nodeCache })
export const propertyActionService = new PropertyActionService({ cache: nodeCache })
export const auctionService = new AuctionService({ cache: nodeCache })
  

export const cellController = new CellController(cellService)
export const gameBoardController = new GameBoardController(gameBoardService) 
export const playerController = new PlayerController(playerService)
export const diceController = new DiceController(diceService)
export const moveController = new MoveController(moveService)
export const propertyActionController = new PropertyActionController(propertyActionService)
export const auctionController = new AuctionController(auctionService)


export const boardHandlers: HandlersType = {
  connection: [gameBoardController.handleMessage, authController.handleMessage],
  disconect: [gameBoardController.handleMessage, authController.handleMessage],

  roolDice: [moveController.handleMessage],
  finishedMove: [moveController.handleMessage],

  pay: [gameBoardController.handleMessage],

  buyProperty: [propertyActionController.handleMessage],
  updateProperty: [propertyActionController.handleMessage],
  mortgageProperty: [propertyActionController.handleMessage],

  playerGameOver: [gameBoardController.handleMessage],

  auctionRefresh: [auctionController.handleMessage],
};