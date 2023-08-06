import { Model } from 'mongoose';
import { WebSocket } from 'ws';
import { GameBoardModel } from '../models/index.js';
import { CacheManager, broadcastConnection, logger, randomValue, getUnicNumber, checkCellType, chanceCards, lotteryCards, nextPlayerQueue } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';
import { diceService, playerService, propertyService } from '../handlers/index.js';


export class MoveService {
  private readonly model: Model<types.IGameBoard>;
  private cache: CacheManager<types.IGameBoard | types.IGameBoard[]>;

  constructor({
    cache,
  }: {
    cache: CacheManager<types.IGameBoard>;
  }) {
    this.model = GameBoardModel;
    this.cache = cache;
  }

  async roolDice(ws: WebSocket, message: DTO.UpdateDiceDTO): Promise<void | types.IReturnErrorObj> {
    try {
      if (!message) {
        throw new Error('Failed message in rool dice')
      }
      const { board_id, dice_id, in_jail, player_id, user_name, ws_id, players } = message.body
      let boardUpdate = null;
      let playerUpdate = null;
      
      const dice = await diceService.diceUpdate({ dice_id, player_id, user_name })
       if (typeof dice === 'string') {
        throw new Error (dice)
      } 

      if (in_jail) {
        playerUpdate = await playerService.updateTheatre({ player_id, isDouble: dice.dice1 === dice.dice2 })
        if (typeof playerUpdate === 'string') {
          throw new Error('Failed update jail count')
        }

        if (playerUpdate.in_jail) {
          const currentPlayerId = nextPlayerQueue(players, player_id, dice.dice1 === dice.dice2)
          
          boardUpdate = await this.model.findByIdAndUpdate(board_id,
            {currentPlayerId},
            {returnDocument: 'after'},
            )
        }
      }

      const broadData = {
        method: message.method,
        title: `Игрок: ${user_name} выкидывает ${dice.dice1} и ${dice.dice2}`,
        data: {
          dice,
          playerUpdate,
          boardUpdate,
        }
      };

      broadcastConnection(ws_id, ws, broadData);
      
    } catch (error) {
      logger.error('Failed to update dice in service:', error);
      return { error, text: 'Failed to update dice in service' };
    }
  }

  async finishedMove(ws: WebSocket, message: DTO.BoardFinishedMoveDTO): Promise<void | types.IReturnErrorObj> {
    try {
      if (!message) {
        throw new Error('Failed message in finished move')
      }
      const { newPosition, player_id, previous_position, cell_id, cell, ws_id } = message.body

      
     const player = await playerService.updatePosition({
        player_id,
        newPosition,
        previous_position,
      }) as types.IPlayer
      

      if (typeof player === 'string' || !cell ) {
        throw new Error ('Failed get cell or playerUpdate in board')
      }     

      const cellType = checkCellType(cell.type) as 'property' | 'action' | 'corner' | 'tax'

      switch (cellType) {
        case 'property':
          await this.moveFinishProperty(ws_id, ws, message, cell, player)
          break;
        case 'action':
          await this.moveFinishAction(ws_id, ws, message, cell)
          break;
        case 'tax':
          await this.moveFinishTax(ws_id, ws, message, cell, player, newPosition, cell_id)
          break;
        case 'corner':
          await this.moveFinishCorner(ws_id, ws, message, cell, player)
          break;
      }
      
    } catch (error) {
      logger.error('Failed to update  in finished move:', error);
      return { error, text: 'Failed to  player in finished move' };
    }
  }

  async moveFinishProperty(boardId: number, ws: WebSocket, message: DTO.BoardFinishedMoveDTO, cell: types.ICell, player: types.IPlayer) {
    try {
      const { cell, board_id, cell_id, isDouble, newPosition, player_id,  players, } = message.body
    
      /** 4 состояния. 1 некуплено. 2 другого игрока. 3 своя. 4 другого игрока заложено */
      const checkProperty = await propertyService.checkProperty({ board_id, cell_id, player_id, cell }) as { myProperty: boolean; canBuy: boolean; rent: number; isMortgage: boolean }
          if (typeof checkProperty === 'string') {
            throw new Error(checkProperty)
          }
          
      const { canBuy, myProperty, rent, isMortgage } = checkProperty

      let currentPlayerId = player_id
      let action = 'start move';
      let price = 0;  
      
      if (canBuy) {
        action = 'can buy';
        price = cell.price;
      } else if (!myProperty) {
        if (!isMortgage) {
          action = 'need pay'; 
          price = rent;
        } else {
          currentPlayerId = nextPlayerQueue(players, player_id, isDouble)
        }
      } else if (myProperty) {
        currentPlayerId = nextPlayerQueue(players, player_id, isDouble)
      }

      const board = await this.model.findByIdAndUpdate(message.body.board_id, {
        currentPlayerId, // Текущяя очередь игрока
        action, // Текущее действие игрока
        price, // Нужно к уплате
        currentCellPosition: newPosition, // текущая позиция ячейки
        currentCellId: cell_id, // ID текущей ячейки
      }, { returnDocument: 'after' }) as types.IGameBoard
  
      this.cache.addKeyInCache(board_id, board)
 
      const broadData = {
        method: message.method,
        title: `Игрок ${player.name} останавливается на ${cell.name}`,
        data: {
          board,
          player,
        },
      };
  
      broadcastConnection(boardId, ws, broadData);
    } catch (error) {
      logger.error('Failed to update finished move cell corner:', error);
      return { error, text: 'Failed to update finished move cell corner' };
    }
  }

  async moveFinishCorner(boardId: number, ws: WebSocket, message: DTO.BoardFinishedMoveDTO, cell: types.ICell, player: types.IPlayer) {
    try {
      const { board_id, cell_id, isDouble, newPosition, player_id,  player_name, players, previous_position } = message.body

      let title = `Игрок: ${player_name} останавливается на поле ${cell.name}`
      let currentPlayer = player

      if (cell.type === 'visit theater') {
        currentPlayer = await playerService.positionTheatre({
          player_id,
          previous_position,
        }) as types.IPlayer
        title = `Игрок: ${player_name} перемещается на поле театр`
      }
       
      const currentPlayerId = nextPlayerQueue(players, player_id, isDouble)

      const board = await this.model.findByIdAndUpdate(message.body.board_id, {
        currentPlayerId, // Текущяя очередь игрока
        action: 'start move', // Текущее действие игрока
        currentCellPosition: newPosition, // текущая позиция ячейки
        currentCellId: cell_id, // ID текущей ячейки
      }, { returnDocument: 'after' }) as types.IGameBoard
  
      this.cache.addKeyInCache(board_id, board)
 
      const broadData = {
        method: message.method,
        title,
        data: {
          board,
          player: currentPlayer,
        },
      };
  
      broadcastConnection(boardId, ws, broadData);
    } catch (error) {
      logger.error('Failed to update finished move cell corner:', error);
      return { error, text: 'Failed to update finished move cell corner' };
    }
  }

  async moveFinishAction(boardId: number, ws: WebSocket, message: DTO.BoardFinishedMoveDTO, cell: types.ICell) {
    try {
      const { board_id, cell_id, isDouble, newPosition, player_id, players,  chanse_current, lottery_current } = message.body
      let chanceCurrent = chanse_current
      let lotteryCurrent = lottery_current
      let actionCard = null;
      
      if (cell.type === 'action-chance') {
        chanceCurrent = chanse_current >= 16 ? 1 : chanceCurrent + 1
        actionCard = chanceCards.get(chanceCurrent)
      } else {
        lotteryCurrent = lottery_current >= 9 ? 1 : lotteryCurrent + 1
        actionCard = lotteryCards.get(lotteryCurrent)
      }

      if (!actionCard) {
        throw new Error('Failed to action card')
      }

      const price = !actionCard.increment ? actionCard.price : 0
      const action = !actionCard.increment ? 'need pay' : 'start move'
      const currentPlayerId = !actionCard.increment ? player_id : nextPlayerQueue(players, player_id, isDouble)

      const board = await this.model.findByIdAndUpdate(message.body.board_id, {
        currentPlayerId, // Текущяя очередь игрока
        action, // Текущее действие игрока
        currentCellPosition: newPosition, // текущая позиция ячейки
        currentCellId: cell_id, // ID текущей ячейки
        chanse_current: chanceCurrent,
        lottery_current: lotteryCurrent,
        price,
      }, { returnDocument: 'after' }) as types.IGameBoard
  
      this.cache.addKeyInCache(board_id, board)

      const player = await playerService.moneyUpdate(player_id, actionCard.price, actionCard.increment)
  
      const broadData = {
        method: message.method,
        title: actionCard.text,
        data: {
          board,
          player,
        },
      };
  
      broadcastConnection(boardId, ws, broadData);
    } catch (error) {
      logger.error('Failed to update finished move cell action:', error);
      return { error, text: 'Failed to update finished move cell action' };
    }
  }

  async moveFinishTax(boardId: number, ws: WebSocket, message: DTO.BoardFinishedMoveDTO, cell: types.ICell, player: types.IPlayer, newPosition: number, cell_id: string) {
    try {
      const board = await this.model.findByIdAndUpdate(message.body.board_id, {
        action: 'need pay', // Текущее действие игрока
        price: cell.price, // Текущяя оплата
        currentCellPosition: newPosition, // текущая позиция ячейки
        currentCellId: cell_id, // ID текущей ячейки
      }, { returnDocument: 'after' }) as types.IGameBoard
  
      this.cache.addKeyInCache(message.body.board_id, board)
  
      const broadData = {
        method: message.method,
        title: `Игроку: ${message.body.player_name} придется оплатить налог в размере ${cell.price}`,
        data: {
          board,
          player,
        },
      };
  
      broadcastConnection(boardId, ws, broadData);
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

}