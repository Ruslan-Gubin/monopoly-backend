import { Model } from 'mongoose';
import { WebSocket } from 'ws';
import { GameBoardModel } from '../models/index.js';
import { CacheManager, logger, } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';


export class AuctionService {
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

  async auctionRefresh(ws: WebSocket, message: DTO.AuctionRefreshDTO) {
    try {
      const { cell_name, player_name, property_price, ws_id } = message.body
      console.log( cell_name, player_name, property_price, ws_id )
      // const nexPlayerId = nextPlayerQueue(players, player_id, isDouble)
      // let propertyOwner = null;
    
      // const board = await this.model.findByIdAndUpdate(board_id, {
      //   currentPlayerId: nexPlayerId,
      //   action: 'start move',
      //   price: 0,
      // }, { returnDocument: 'after' }) as types.IGameBoard
  
      // this.cache.addKeyInCache(board_id, board)
  
      // const player = await playerService.moneyUpdate(player_id, price, false)

      // if (propertyOwnerId) {
      //  propertyOwner = await playerService.moneyUpdate(propertyOwnerId, price, true)
      // }
  
      // const broadData = {
      //   method: message.method,
      //   title: `Игрок ${player_name} оплачивает: ${price} руб`,
      //   data: {
      //     board,
      //     player,
      //     propertyOwner,
      //   },
      // };
  
      // broadcastConnection(ws_id, ws, broadData);
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

}