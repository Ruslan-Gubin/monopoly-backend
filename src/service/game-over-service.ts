import { WebSocket } from 'ws';
import { auctionService, gameBoardService, playerService, propertyService } from '../handlers/index.js';
import { broadcastConnection, logger, nextPlayerQueue, } from '../utils/index.js';
import * as DTO from '../dtos/index.js';


export class GameOverService {
  constructor() {}

  async playerGameOver(ws: WebSocket, message: DTO.GameOverPropsDTO) {
    try {
      const { player_id, ws_id, board_id, player_name } = message.body
      let title = `Игрок ${player_name} становится банкротом`

      const player = await playerService.updateFields(player_id, { is_active: false })
      await propertyService.removePlayerPropertys(player_id) // удалить на клиенте все связанные с игроком пропертиес
      const board = await gameBoardService.getBoardId(board_id)
      if (typeof board === 'string') {
        throw new Error(board)
      }

      const players = board.players.filter((elem) => elem !== player_id)
      const currentPlayerId = nextPlayerQueue(board.players, player_id, false)
      const updateBoardFields = { players, action: "start move", currentPlayerId }
      Object.assign(board, updateBoardFields)



      if (players.length <= 1) {
        console.log('Victory')
      }


      /**
       * на клиенте проверяем если игрок остается последним 
       * или какой нибуть стайт об конце игры,
       * модальное окно можно показать вместо центра игры.
       * показываем модальное окно, внизу ок по которому может
       * кликнуть последний игрок, при нажатии на сервер отправляется все 
       * данные игрового поля которые удаляют все сущности связанные с игрой
       * и перекидывает игроков на главную страницу 
       */


      //const players = await playerService.getBoardPlayers(board.players)




      // const auction = await auctionService.getAuctionId(auction_id)
      // if (typeof auction === 'string') {
      //   throw new Error(auction)
      // }

      // const board = await gameBoardService.getBoardId(board_id)
      // if (typeof board === 'string') {
      //   throw new Error(board)
      // }

      // const updateAuctionFields = { players, is_active: true, price: property_price, last_player_bet: null }
      // const updateBoardFields = { action: 'auction' }

      // Object.assign(auction, updateAuctionFields)
      // Object.assign(board, updateBoardFields)
 
      // const broadData = {
      //   method: message.method,
      //   title: `Игрок ${player_name} обьявляет аукцион на недвижемость ${cell_name} начальная цена ${property_price} руб`,
      //   data: {
      //       board,
      //       auction,
      //   },
      // };

      // broadcastConnection(ws_id, ws, broadData);

      // await gameBoardService.updateBoard(board_id, updateBoardFields)
      // await auctionService.updateAuction(auction_id, updateAuctionFields)
    } catch (error) {
      logger.error('Failed to update finished move cell tax:', error);
      return { error, text: 'Failed to update finished move cell tax' };
    }
  }

}