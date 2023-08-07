import * as controller from '../controllers/index.js';
import * as service from '../service/index.js';
import { HandlersType } from '../types/index.js';
import { nodeCache } from '../utils/index.js';
import { authController } from './session-handlers.js';

export const gameBoardService = new service.GameBoardService({ cache: nodeCache });
export const playerService = new service.PlayerService({ cache: nodeCache });
export const diceService = new service.DiceService({ cache: nodeCache });
export const cellService = new service.CellService({ cache: nodeCache });
export const propertyService = new service.PropertyService({ cache: nodeCache });
export const moveService = new service.MoveService({ cache: nodeCache });
export const propertyActionService = new service.PropertyActionService({ cache: nodeCache });
export const auctionActionService = new service.AuctionActionService();
export const auctionService = new service.AuctionService({ cache: nodeCache });
export const gameOverService = new service.GameOverService();

export const cellController = new controller.CellController(cellService);
export const gameBoardController = new controller.GameBoardController(gameBoardService);
export const playerController = new controller.PlayerController(playerService);
export const diceController = new controller.DiceController(diceService);
export const moveController = new controller.MoveController(moveService);
export const propertyActionController = new controller.PropertyActionController(propertyActionService);
export const auctionActionControllerer = new controller.AuctionActionController(auctionActionService);
export const gameOverController = new controller.GameOverController(gameOverService);

export const boardHandlers: HandlersType = {
  connection: [gameBoardController.handleMessage, authController.handleMessage],
  disconect: [gameBoardController.handleMessage, authController.handleMessage],

  roolDice: [moveController.handleMessage],
  finishedMove: [moveController.handleMessage],

  pay: [gameBoardController.handleMessage],

  buyProperty: [propertyActionController.handleMessage],
  updateProperty: [propertyActionController.handleMessage],
  mortgageProperty: [propertyActionController.handleMessage],

  playerGameOver: [gameOverController.handleMessage],

  auctionRefresh: [auctionActionControllerer.handleMessage],
  auctionAction: [auctionActionControllerer.handleMessage],
};
