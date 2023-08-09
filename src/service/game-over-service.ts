import { WebSocket } from 'ws';
import {  auctionService, diceService, gameBoardService, playerService, propertyService } from '../handlers/index.js';
import { broadcastConnection, logger, nextPlayerQueue, } from '../utils/index.js';
import * as DTO from '../dtos/index.js';


export class GameOverService {
  constructor() {}

  async playerGameOver(ws: WebSocket, message: DTO.GameOverPropsDTO) {
    try {
      const { player_id, ws_id, board_id, player_name } = message.body
      let title = `Игрок ${player_name} становится банкротом`;
      let boardAction = 'start move';


      const player = await playerService.findPlayerId(player_id)
      if (typeof player === 'string') {
        throw new Error(player)
      }

      const board = await gameBoardService.getBoardId(board_id)
      if (typeof board === 'string') {
        throw new Error(board)
      }

      const players = board.players.filter((elem) => elem !== player_id)

      if (players.length <= 1) {
        boardAction = 'end game';
        const lastPlayer = await playerService.findPlayerId(players[0])
        if (typeof lastPlayer === 'string') {
          throw new Error(lastPlayer)
        }
        title = `Игрок ${lastPlayer.name} победитель в этой игре`
      }

      const currentPlayerId = nextPlayerQueue(board.players, player_id, false)
      const updateBoardFields = { players, action: boardAction, currentPlayerId }
      const updatePlayerFields = { is_active: false }

      Object.assign(board, updateBoardFields)
      Object.assign(player, updatePlayerFields)


      const broadData = {
        method: message.method,
        title,
        data: {
            board,
            player,
        },
      }; 

      broadcastConnection(ws_id, ws, broadData);

      await gameBoardService.updateBoard(board_id, updateBoardFields)
      await playerService.updateFields(player_id, updatePlayerFields)
      await propertyService.removePlayerPropertys(player_id) // удалить все связанные с игроком propertyes
      await playerService.removePlayer(player_id)
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

  async removeGame(body: DTO.RemoveGameDTO) {
    try {
      const { board_id, auction_id, dice_id, player_id } = body
      await auctionService.removeAuction(auction_id)
      await diceService.removeDice(dice_id)
      await gameBoardService.removeBoard(board_id)
      await playerService.removePlayer(player_id)
      await propertyService.removeAllPropertysBoard(board_id)
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

}