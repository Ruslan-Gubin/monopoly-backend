import { WebSocket } from 'ws';
import {  gameBoardService, playerService } from '../handlers/index.js';
import { broadcastConnection, logger, nextPlayerQueue, } from '../utils/index.js';
import * as DTO from '../dtos/index.js';


export class PayService {
  constructor() {}

  async payPrice(ws: WebSocket, message: DTO.BoardPayTaxDTO) {
    try {
      const { board_id, player_id, price, isDouble, player_name, players, propertyOwnerId, ws_id } = message.body
      let propertyOwner = null;
      let ownerUpdateFields = null;
      
      const board = await gameBoardService.getBoardId(board_id)
      if (typeof board === 'string') throw new Error(board)
      
      const currentPlayerId = nextPlayerQueue(players, player_id, isDouble)
      const boardUpdateFields = { currentPlayerId, action: 'start move', price: 0 }
      Object.assign(board, boardUpdateFields)

      const playerPay = await playerService.findPlayerId(player_id)
      if (typeof playerPay === 'string') throw new Error(playerPay)

      const playerPayUpdateFields = { money: playerPay.money - price }
      Object.assign(playerPay, playerPayUpdateFields)

      if (propertyOwnerId) {
      const playerOwner = await playerService.findPlayerId(propertyOwnerId)
      if (typeof playerOwner === 'string') throw new Error(playerOwner)

      ownerUpdateFields = { money: playerOwner.money + price  }
      Object.assign(playerOwner, ownerUpdateFields)
      propertyOwner = playerOwner
      }
  
      const broadData = {
        method: message.method,
        title: `${player_name} оплачивает: ${price} руб`,
        data: {
          board,
          player: playerPay,
          propertyOwner,
        },
      };
  
      broadcastConnection(ws_id, ws, broadData);

      await gameBoardService.updateBoard(board_id, boardUpdateFields)
      await playerService.updateFields(player_id, playerPayUpdateFields)
      if (propertyOwnerId && ownerUpdateFields) {
      await playerService.updateFields(propertyOwnerId, ownerUpdateFields) 
      }
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

}