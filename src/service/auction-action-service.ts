import { WebSocket } from 'ws';
import { auctionService, gameBoardService, playerService, propertyService } from '../handlers/index.js';
import { broadcastConnection, logger, nextPlayerQueue, } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import {  ICell } from '../types/index.js';


export class AuctionActionService {
  constructor() {}

  async auctionRefresh(ws: WebSocket, message: DTO.AuctionRefreshDTO) {
    try {
      const { cell_name, player_name, property_price, ws_id, board_id, players, auction_id } = message.body

      const auction = await auctionService.getAuctionId(auction_id)
      if (typeof auction === 'string') {
        throw new Error(auction)
      }

      const board = await gameBoardService.getBoardId(board_id)
      if (typeof board === 'string') {
        throw new Error(board)
      }

      const updateAuctionFields = { players, is_active: true, price: property_price, last_player_bet: null }
      const updateBoardFields = { action: 'auction' }

      Object.assign(auction, updateAuctionFields)
      Object.assign(board, updateBoardFields)
 
      const broadData = {
        method: message.method,
        title: `Игрок ${player_name} обьявляет аукцион на недвижемость ${cell_name} начальная цена ${property_price} руб`,
        data: {
            board,
            auction,
        },
      };

      broadcastConnection(ws_id, ws, broadData);

      await gameBoardService.updateBoard(board_id, updateBoardFields)
      await auctionService.updateAuction(auction_id, updateAuctionFields)
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

  async auctionAction(ws: WebSocket, message: DTO.AuctionActionhDTO) {
    try {
      const { player_name, ws_id, board_id, auction_id, action, player_id, price, players, last_player_bet, isDouble, playersQueue, currentPlayerQueue, cell_name, cell } = message.body
      let playersList = players
      let isActive = true;
      let lastPlayer = last_player_bet;
      let currentPrice = price
      let board = null;
      let updateBoardFields = null;
      let player = null;
      let property = null;
      let title = '';

      if (action) {
        currentPrice + 50;
        lastPlayer = player_id
        title = `Игрок ${player_name} повышает ставки до ${currentPrice} руб`
      } else {
        playersList = playersList.filter(player => player !== player_id)
        title = `Игрок ${player_name} отказывается от участия в аукционе`
      }


      if (playersList.length === 1 && lastPlayer) { 
      const { newProperty, updatePlayer } = await this.winAuction(lastPlayer, price, board_id, player_id, cell)
      const { updateBoard, updateFields } = await this.updateQueue(board_id, playersQueue, currentPlayerQueue, isDouble)
      property = newProperty
      player = updatePlayer
      board = updateBoard
      updateBoardFields = updateFields
      
      title = `Игрок ${player.name} выигрывает в аукционе ${cell_name} за ${price} Руб`;
      playersList = [];
      isActive = false;
      lastPlayer = null;
      currentPrice = 0;
      }
      

      if (playersList.length === 0 && !lastPlayer) {
        isActive = false;
        currentPrice = 0;
        lastPlayer = null;
        title = `Аукцион не состоялся`
        const { updateBoard, updateFields } = await this.updateQueue(board_id, playersQueue, currentPlayerQueue, isDouble)
        board = updateBoard
        updateBoardFields = updateFields
      }
      
      const auction = await auctionService.getAuctionId(auction_id)
      if (typeof auction === 'string') {
        throw new Error(auction)
      }

      const updateAuctionFields = { players: playersList,  price: currentPrice, is_active: isActive, last_player_bet: lastPlayer }
      Object.assign(auction, updateAuctionFields)
      

      if (board && updateBoardFields) {
        Object.assign(board, updateBoardFields)
      }
 
      const broadData = {
        method: message.method,
        title,
        data: {
            board,
            auction,
            player,
            property: property?.property,
            manyProperty: property?.manyUpdates,
        },
      };

      broadcastConnection(ws_id, ws, broadData);

      await auctionService.updateAuction(auction_id, updateAuctionFields)
      if (board && updateBoardFields) {
        await gameBoardService.updateBoard(board_id, updateBoardFields)
      }
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

 private async winAuction(lastPlayer: string, price: number, board_id: string, player_id: string, cell: ICell) {
   const updatePlayer = await playerService.moneyUpdate(lastPlayer, price, false)
    if (typeof updatePlayer === 'string') {
      throw new Error('Failed to update player many in auction buy property')
    }

   const newProperty = await propertyService.create({ board_id, player_id, cell, player_color: updatePlayer.color })
   if (typeof newProperty === 'string') {
    throw new Error(newProperty)
  }  
  return { updatePlayer, newProperty }
  }

 private async updateQueue(board_id: string,playersQueue: string[], currentPlayerQueue: string, isDouble: boolean ) {
 const board = await gameBoardService.getBoardId(board_id)
  if (typeof board === 'string') {
    throw new Error(board)
  }
  const currentPlayerId = nextPlayerQueue(playersQueue, currentPlayerQueue, isDouble)
 const updateBoardFields = { action: 'start move', currentPlayerId, price: 0 }
  Object.assign(board, updateBoardFields)

  return { updateFields: updateBoardFields, updateBoard: board }
  }

}