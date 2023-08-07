import { gameBoardService, playerService, propertyService } from '../handlers/index.js';
import { logger, nextPlayerQueue, } from '../utils/index.js';
export class GameOverService {
    constructor() { }
    async playerGameOver(ws, message) {
        try {
            const { player_id, ws_id, board_id, player_name } = message.body;
            let title = `Игрок ${player_name} становится банкротом`;
            const player = await playerService.updateFields(player_id, { is_active: false });
            await propertyService.removePlayerPropertys(player_id);
            const board = await gameBoardService.getBoardId(board_id);
            if (typeof board === 'string') {
                throw new Error(board);
            }
            const players = board.players.filter((elem) => elem !== player_id);
            const currentPlayerId = nextPlayerQueue(board.players, player_id, false);
            const updateBoardFields = { players, action: "start move", currentPlayerId };
            Object.assign(board, updateBoardFields);
            if (players.length <= 1) {
                console.log('Victory');
            }
        }
        catch (error) {
            logger.error('Failed to update finished move cell tax:', error);
            return { error, text: 'Failed to update finished move cell tax' };
        }
    }
}
