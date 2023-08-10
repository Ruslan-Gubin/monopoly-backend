import { WebSocket } from 'ws';
import { broadcastConnection, logger, checkCellType, chanceCards, lotteryCards, nextPlayerQueue } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';
import { diceService, gameBoardService, playerService, propertyService } from '../handlers/index.js';


export class MoveService {
  constructor() {}

  async roolDice(ws: WebSocket, message: DTO.UpdateDiceDTO): Promise<void | types.IReturnErrorObj> {
    try {
      if (!message) {
        throw new Error('Failed message in rool dice')
      }
      const { board_id, dice_id, in_jail, player_id, user_name, ws_id, players, current_jail } = message.body
      let playerUpdateFields = null;
      let boardUpdateFields = null;
      let player = null;
      let board = null;

      const diceUpdateFields = diceService.roolUpdateFields(player_id)
      const dice = await diceService.getDiceInBoard(dice_id)
      if (typeof dice === 'string') throw new Error(dice)
      Object.assign(dice, diceUpdateFields)
      

      if (in_jail) {
        player = await playerService.findPlayerId(player_id)
        if (typeof player === 'string') throw new Error(player)
        playerUpdateFields = { in_jail: true, current_jail: current_jail -1 }
        Object.assign(player, playerUpdateFields)

        if (player.current_jail === 0 || dice.isDouble) {
          playerUpdateFields = { in_jail: false, current_jail: 0 }
          Object.assign(player, playerUpdateFields)
        }

        if (player.in_jail) {
          board = await gameBoardService.getBoardId(board_id)
          const currentPlayerId = nextPlayerQueue(players, player_id, dice.isDouble)
          boardUpdateFields = { currentPlayerId }
          Object.assign(board, boardUpdateFields)
        }
      }
      
      const doubleText = dice.isDouble ? 'дубль' : ''

      const broadData = {
        method: message.method,
        title: `${user_name} выкидывает ${doubleText} ${dice.dice1} и ${dice.dice2}`,
        data: {
          dice,
          player,
          board,
        }
      };

      broadcastConnection(ws_id, ws, broadData);

      await diceService.diceUpdate({ dice_id, fields: diceUpdateFields })
      if (player) await playerService.updateFields(player_id, playerUpdateFields)
      if (board) await gameBoardService.updateBoard(board_id, boardUpdateFields)
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
      const { cell_name, cell_price, newPosition, player_id, previous_position, ws_id, board_id, cell_type } = message.body
      
      const player = await playerService.findPlayerId(player_id)
      if (typeof player === 'string') throw new Error(player)
      const initMoney = previous_position > newPosition ? player.money + 200 : player.money;

      const board = await gameBoardService.getBoardId(board_id)
      if (typeof board === 'string') throw new Error(board)

      let playerUpdateFields = { position: newPosition, money: initMoney }
      let boardUpdateFields = null;
      let title = `${player.name} попадает на поле ${cell_name}`;
    
      
      const cellType = checkCellType(cell_type) as 'property' | 'action' | 'corner' | 'tax';

      switch (cellType) {
        case 'property':
        const updatesProperty =  await this.moveFinishProperty(message.body, board.players)
        if (typeof updatesProperty === 'string') throw new Error(updatesProperty)
        boardUpdateFields = updatesProperty
          break;
        case 'action':
        const updatesAction = await this.moveFinishAction(message.body, initMoney, board.chanse_current, board.lottery_current, board.players, player.name)
        if (typeof updatesAction === 'string') throw new Error(updatesAction)

          boardUpdateFields = updatesAction.updateBoard;
          title = updatesAction.title;
          playerUpdateFields.money = updatesAction.totalMoney;
          break;
        case 'tax':
        const updatesTax = this.moveFinishTax(cell_price, player.name)
        if (typeof updatesTax === 'string') throw new Error(updatesTax)

        title = updatesTax.title
        boardUpdateFields = updatesTax.updateBoard
          break;
        case 'corner':
        const updatesCorner = this.moveFinishCorner(message.body, board.players, player.name)
        if (typeof updatesCorner === 'string') throw new Error(updatesCorner)
        
        Object.assign(playerUpdateFields, updatesCorner.playerUpdate);
        title = updatesCorner.title ? updatesCorner.title : title;
        boardUpdateFields = updatesCorner.boardUpdate
        break;
      }

      Object.assign(player, playerUpdateFields)
      Object.assign(board, boardUpdateFields)

      const broadData = {
        method: message.method,
        title,
        data: {
          board,
          player,
        },
      };

      broadcastConnection(ws_id, ws, broadData);

      await playerService.updateFields(player_id, playerUpdateFields)
      await gameBoardService.updateBoard(board_id, boardUpdateFields)
    } catch (error) {
      logger.error('Failed to update  in finished move:', error);
      return { error, text: 'Failed to  player in finished move' };
    }
  }

  async moveFinishProperty(body: DTO.FinishMoveBodyDTO, players: string[]) {
    try {
      const { cell_rent, cell_price, board_id, cell_id, isDouble, player_id,  property_id } = body
    
      const checkProperty = await propertyService.checkProperty({ board_id, cell_id, player_id, cell_rent, property_id })
          if (typeof checkProperty === 'string') {
            throw new Error(checkProperty)
          }
          
      const { canBuy, myProperty, rent, isMortgage } = checkProperty

      let currentPlayerId = player_id
      let action = 'start move';
      let price = 0;
      
      if (canBuy) {
        action = 'can buy';
        price = cell_price;
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

      const boardUpdateFields = { currentPlayerId, action, price }

      return boardUpdateFields;
    } catch (error) {
      logger.error('Failed to update finished move cell corner:', error);
      return 'Failed to update finished move cell corner';
    }
  }

  private moveFinishCorner(body: DTO.FinishMoveBodyDTO, players: string[], player_name: string) {
    try {
      const { isDouble, cell_type, player_id } = body

      let title = null;
      let playerUpdate = {};

      if (cell_type === 'visit theater') {
        title = `${player_name} перемещается в театр`;
        playerUpdate = { position: 10, in_jail: true, current_jail: 4 }
      }

      const currentPlayerId = nextPlayerQueue(players, player_id, isDouble)
      const boardUpdate = { currentPlayerId, action: 'start move' }

  return {
    boardUpdate,
    playerUpdate,
    title,
  }
    } catch (error) {
      logger.error('Failed to update finished move cell corner:', error);
      return 'Failed to update finished move cell corner';
    }
  }

  async moveFinishAction(body: DTO.FinishMoveBodyDTO, initMoney: number, chanse_current: number, lottery_current: number, players: string[], player_name: string) {
    try {
      const { cell_type, isDouble, player_id } = body

      let chanceCurrent = chanse_current
      let lotteryCurrent = lottery_current
      let actionCard = null;
      let cellTypeText = null;
      
      if (cell_type === 'action-chance') {
        chanceCurrent = chanse_current >= 16 ? 1 : chanceCurrent + 1
        actionCard = chanceCards.get(chanceCurrent)
        cellTypeText = `${player_name} попадает на поле Шанс`
      } else {
        lotteryCurrent = lottery_current >= 9 ? 1 : lotteryCurrent + 1
        actionCard = lotteryCards.get(lotteryCurrent)
        cellTypeText = `${player_name} попадает на поле Лотерея`
      }

      if (!actionCard) {
        throw new Error('Failed to action card')
      }

      const price = !actionCard.increment ? actionCard.price : 0;
      const action = !actionCard.increment ? 'need pay' : 'start move';
      const currentPlayerId = !actionCard.increment ? player_id : nextPlayerQueue(players, player_id, isDouble);

      const updateBoard = { currentPlayerId, action, price, chanse_current: chanceCurrent, lottery_current: lotteryCurrent };
      
      const totalMoney = actionCard.increment ? initMoney + actionCard.price : initMoney;
      
      return {
        title: `${cellTypeText} ${actionCard.text}`,
        updateBoard,
        totalMoney,
        }

    } catch (error) {
      logger.error('Failed to update finished move cell action:', error);
      return 'Failed to update finished move cell action';
    }
  }

   moveFinishTax(cell_price: number, player_name: string) {
    try {
      if (!cell_price || !player_name) {
        throw new Error('Failed to props in move finish tax service')
      }

      const updateBoard = { action: 'need pay', price: cell_price }

      return {
        updateBoard,
        title: `${player_name} должен оплатить налог в размере ${cell_price}`,
      }

    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return 'Failed to update finished move cell tax';
    }
  }

}