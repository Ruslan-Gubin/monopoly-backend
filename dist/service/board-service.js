import { GameBoardModel } from '../models/index.js';
import { broadcastConnection, logger, randomValue } from '../utils/index.js';
import { diceService, playerService } from '../routes/index.js';
import { SESSION_ID } from '../config/web-socked.js';
export class GameBoardService {
    constructor({ cache, }) {
        this.allGameBoardKey = 'allGameBoard';
        this.model = GameBoardModel;
        this.cache = cache;
    }
    async createBoard(body, ws) {
        try {
            if (!body) {
                throw new Error('Failed body in create board service');
            }
            const newPlayers = await playerService.createPlayers(body);
            const newDice = await diceService.createDice();
            if (typeof newPlayers === 'string') {
                throw new Error(newPlayers);
            }
            if (typeof newDice === 'string') {
                throw new Error(newDice);
            }
            const playersNameList = newPlayers.map(player => player.name).join(' ');
            const randomPlayer = randomValue(0, newPlayers.length);
            const newBoard = await this.model.create({
                currentPlayerId: newPlayers[randomPlayer]._id,
                players: newPlayers,
                dice: newDice,
            });
            if (!newBoard)
                throw new Error('Failed create board in service');
            await playerService.setBoardIdInPlaers(newPlayers, newBoard._id);
            const id = newBoard._id.toString();
            this.cache.addKeyInCache(id, newBoard);
            const broadData = {
                method: 'createGameBoard',
                title: `Игроки ${playersNameList} перемещаются на игровое поле`,
                board_id: newBoard._id,
                user_id: newPlayers.map(player => player.user_id)
            };
            broadcastConnection(SESSION_ID, ws, broadData);
            return newBoard._id;
        }
        catch (error) {
            logger.error('Failed to create game board in service:', error);
            return { error, text: 'Failed to create game board in service' };
        }
    }
    async getBoardId(boardId) {
        try {
            if (!boardId) {
                throw new Error('Failed get board id in params service');
            }
            let boardCache = this.cache.getValueInKey(boardId);
            if (!boardCache) {
                boardCache = await this.model.find({ _id: boardId });
                this.cache.addKeyInCache(boardId, boardCache);
            }
            if (!boardCache) {
                throw new Error('Failed get board in service');
            }
            return boardCache;
        }
        catch (error) {
            logger.error('Failed to get  game board in service:', error);
            return { error, text: 'Failed to get  game board in service' };
        }
    }
    async deleteAll() {
        const allEntity = await this.model.find({});
        for (const board of allEntity) {
            await this.model.findByIdAndDelete(board._id);
        }
    }
    getGameBoardsCache() {
        return this.cache.getValueInKey(this.allGameBoardKey);
    }
}