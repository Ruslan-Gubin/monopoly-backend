import { Model } from 'mongoose';
import { WebSocket } from 'ws';
import { GameBoardModel } from '../models/index.js';
import { CacheManager, broadcastConnection, logger, randomValue, getUnicNumber, nextPlayerQueue } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';
import { SESSION_ID } from '../config/web-socked.js';
import { cellService, diceService, playerService, propertyService } from '../handlers/index.js';


export class GameBoardService {
  private readonly model: Model<types.IGameBoard>;
  private readonly allGameBoardKey = 'allGameBoard';
  private cache: CacheManager<types.IGameBoard | types.IGameBoard[]>;

  constructor({
    cache,
  }: {
    cache: CacheManager<types.IGameBoard>;
  }) {
    this.model = GameBoardModel;
    this.cache = cache;
  }

  async createBoard(body: DTO.BoardCreateDTO[], ws: WebSocket) {
    try {
      if (!body) {
        throw new Error('Failed body in create board service');
      }

      const newPlayers = await playerService.createPlayers(body)
      const newDice = await diceService.createDice()

      if (typeof newPlayers === 'string') {
        throw new Error(newPlayers);
      }

      if (typeof newDice === 'string') {
        throw new Error(newDice);
      }

      const playersNameList = newPlayers.map(player => player.name).join(' ')
      const randomPlayer = randomValue(0, newPlayers.length)
      const chanse_current = randomValue(1, 16)
      const lottery_current = randomValue(1, 9)

      const newBoard = await this.model.create({ 
        currentPlayerId: newPlayers[randomPlayer]._id,
        players: newPlayers,
        dice: newDice,
        chanse_current,
        lottery_current
      });
   
      if (!newBoard) throw new Error('Failed create board in service');
      
      const boardId = getUnicNumber(newBoard._id)

      const updateBoard = await this.model.findByIdAndUpdate(newBoard._id, { 
        ws_id: boardId 
      }, { returnDocument: 'after' }) as types.IGameBoard
      
      await playerService.setBoardIdInPlaers(newPlayers, newBoard._id)
      
      const id = updateBoard._id.toString()
      this.cache.addKeyInCache(id, updateBoard)

        const broadData = { 
        method: 'createGameBoard',
        title: `Игроки ${playersNameList} перемещаются на игровое поле`,
        board_id: updateBoard._id,
        user_id: newPlayers.map(player => player.user_id) 
      };
    
      broadcastConnection(SESSION_ID, ws, broadData);
      return newBoard._id
    } catch (error) {
      logger.error('Failed to create game board in service:', error);
      return { error, text: 'Failed to create game board in service' };
    }
  }

  async getBoardId(boardId: string) {
      try {
        if (!boardId) {
          throw new Error('Failed get board id in params service')
        }

        let boardCache = this.cache.getValueInKey(boardId)

        if (!boardCache) {
          boardCache = await this.model.findById(boardId)
          if (!boardCache) {
            throw new Error('Failed get board in service')
          }
          this.cache.addKeyInCache(boardId, boardCache)
        }
        
        return boardCache
      } catch (error) {
        logger.error('Failed to get  game board in service:', error);
        return { error, text: 'Failed to get  game board in service' };  
      }
  }

  async connectBoard(ws: types.ExtendedWebSocket, message: DTO.ConnectBoardDTO) {
    try {
      const boardId = getUnicNumber(message.boardId)
      ws.id = boardId

      const board = await this.getBoardId(message.boardId) as types.IGameBoard
      const cells = await cellService.getAllCells('nep')
      const players = await playerService.getBoardPlayers(board.players)
      const propertys = await propertyService.getAllPropertys(message.boardId)
      if (!board || !cells || !players) {
        throw new Error('Failed to board get data'); 
      }
      const dice = await diceService.getDiceInBoard(board.dice.toString())

      ws.send(JSON.stringify({ 
        method: 'connectData', 
        data: {
          board,
          cells,
          players,
          dice,
          propertys,
        } 
      }));

      const broadData = { 
        method: message.method,
        title: `Пользователь ${message.fullName} подключен`,
      };
      
      broadcastConnection(boardId, ws, broadData);
    } catch (error) {
      logger.error('Failed to connection session:', error);
      return { error, text: 'Failed to connection sessio' };
    }
  }

  async payPrice(ws: WebSocket, message: DTO.BoardPayTaxDTO) {
    try {
      const { board_id, player_id, price, isDouble, player_name, players, propertyOwnerId } = message.body
      const boardId = getUnicNumber(board_id)
      const nexPlayerId = nextPlayerQueue(players, player_id, isDouble)
      let propertyOwner = null;
    
      const board = await this.model.findByIdAndUpdate(board_id, {
        currentPlayerId: nexPlayerId,
        action: 'start move',
        price: 0,
      }, { returnDocument: 'after' }) as types.IGameBoard
  
      this.cache.addKeyInCache(board_id, board)
  
      const player = await playerService.moneyUpdate(player_id, price, false)

      if (propertyOwnerId) {
       propertyOwner = await playerService.moneyUpdate(propertyOwnerId, price, true)
      }
  
      const broadData = {
        method: message.method,
        title: `Игрок ${player_name} оплачивает: ${price} руб`,
        data: {
          board,
          player,
          propertyOwner,
        },
      };
  
      broadcastConnection(boardId, ws, broadData);
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

  
  async disconectUser(ws: WebSocket, body: DTO.SessionDisconectBodyDTO) {
    try { 
      // const broadData = {
      //   method: 'disconectUser',
      //   title: `Пользователь ${fullName} отключился`,
      //   outUserId: id,
      //   removeSessionId: removeSession,
      //   outSession,
      // };

      // broadcastConnection(this.sessionId, ws, broadData);
    } catch (error) {
      logger.error('Failed to disconect user in game board service:', error);
      return { error, text: 'Failed to disconect user in game board service' };
    }
  }

 

  private getGameBoardsCache(): types.IGameBoard[] | null {
    return this.cache.getValueInKey(this.allGameBoardKey) as types.IGameBoard[] | null;
  }
}