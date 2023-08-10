import { WebSocket } from 'ws';
import { broadcastConnection, logger, nextPlayerQueue } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import {  gameBoardService, playerService, propertyService } from '../handlers/index.js';


export class PropertyActionService {
  constructor() {}

  async buyProperty(ws: WebSocket, message: DTO.BoardBuyPropertyDTO) {
    try {
      if (!message) {
        throw new Error('Failed to message or  buy property in service')
      }
      const { board_id, player_id, cell, ws_id, isDouble, players, player_color } = message.body

      const property = await propertyService.create({ board_id, player_id, cell, player_color })
       if (typeof property === 'string') throw new Error(property);
           
      const player = await playerService.findPlayerId(player_id)
      if (typeof player === 'string') throw new Error(player)
      const playerUpdateFields = { money: player.money - cell.price }
      player.money = player.money - cell.price

      const board = await gameBoardService.getBoardId(board_id)
      if (typeof board === 'string') throw new Error(board)
      const currentPlayerId = nextPlayerQueue(players, player_id, isDouble)
      const boardUpdateFields = { currentPlayerId, action: 'start move', price: 0 }
      Object.assign(board, boardUpdateFields)

      const broadData = {
        method: message.method,
        title: `${player.name} покупает ${cell.name}`,
        data: {
          player,
          property: property.property,
          manyProperty: property.manyUpdates,
          board,
        },
      };

      broadcastConnection(ws_id, ws, broadData);
      await playerService.updateFields(player_id, playerUpdateFields)
      await gameBoardService.updateBoard(board_id, boardUpdateFields)
    } catch (error) {
      logger.error('Failed to  buy property  in service:', error);
      return { error, text: 'Failed to  buy property  in service' };
    }
 }

  async updateProperty(ws: WebSocket, message: DTO.UpdatePropertyDTO) { 
    try {
      const { player_id, price, property_id, ws_id, player_name, cellName } = message.body
      
      const property = await propertyService.getPropertyId(property_id)
      if (typeof property === 'string') throw new Error(property)
      const current_rent = property.current_rent + 1;
      const house_count = property.house_count + 1;
      property.current_rent = current_rent;
      property.house_count = house_count;
      
      const player = await playerService.findPlayerId(player_id)
      if (typeof player === 'string') throw new Error(player)
      const playerUpdateFields = { money: player.money - price }
      player.money = player.money - price

      const broadData = {
        method: message.method,
        title: `${player_name} улучшает поле ${cellName}`,
        data: {
          player,
          property,
        },
      };
  
      broadcastConnection(ws_id, ws, broadData);
      await playerService.updateFields(player_id, playerUpdateFields)
      await propertyService.updateFields(property_id, { current_rent, house_count })
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

  async mortgageProperty(ws: WebSocket, message: DTO.UpdatePropertyDTO) {
    try {
      const { player_id, price, property_id, ws_id, player_name, cellName, value } = message.body
      
      const property = await propertyService.getPropertyId(property_id)
      if (typeof property === 'string') throw new Error(property)
      property.is_mortgage = value
         
      const player = await playerService.findPlayerId(player_id);
      if (typeof player === 'string') throw new Error(player);
      const money = value ? player.money + price : player.money - price;
      const playerUpdateFields = { money };
      player.money = money;
    
      const titleText = value ? 'закладывает' : 'выкупает';
      
      const broadData = {
        method: message.method,
        title: `${player_name} ${titleText} поле ${cellName}`,
        data: {
          player,
          property,
        },
      };
  
      broadcastConnection(ws_id, ws, broadData);
      await playerService.updateFields(player_id, playerUpdateFields);
      await propertyService.updateFields(property_id, { is_mortgage: value })
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

}