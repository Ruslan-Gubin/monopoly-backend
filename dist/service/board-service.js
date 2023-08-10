import { GameBoardModel } from '../models/index.js';
import { broadcastConnection, logger, randomValue, getUnicNumber } from '../utils/index.js';
import { SESSION_ID } from '../config/web-socked.js';
import { auctionService, cellService, diceService, playerService, propertyService } from '../handlers/index.js';
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
            const auction = await auctionService.createAuction();
            if (typeof auction === 'string')
                throw new Error(auction);
            if (typeof newPlayers === 'string')
                throw new Error(newPlayers);
            if (typeof newDice === 'string')
                throw new Error(newDice);
            const playersNameList = newPlayers.map(player => player.name).join(' ');
            const randomPlayer = randomValue(0, newPlayers.length);
            const chanse_current = randomValue(1, 16);
            const lottery_current = randomValue(1, 9);
            const newBoard = await this.model.create({
                currentPlayerId: newPlayers[randomPlayer]._id,
                players: newPlayers.map(player => player._id),
                auction_id: auction._id.toString(),
                dice: newDice,
                chanse_current,
                lottery_current,
            });
            if (!newBoard)
                throw new Error('Failed create board in service');
            const boardId = newBoard._id.toString();
            const ws_id = getUnicNumber(boardId);
            await this.updateBoard(boardId, { ws_id });
            const broadData = {
                method: 'createGameBoard',
                title: `Игроки ${playersNameList} перемещаются на игровое поле`,
                board_id: boardId,
                user_id: newPlayers.map(player => player.user_id),
            };
            broadcastConnection(SESSION_ID, ws, broadData);
            return boardId;
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
                boardCache = await this.model.findById(boardId);
                if (!boardCache) {
                    throw new Error('Failed get board in service');
                }
                this.cache.addKeyInCache(boardId, boardCache);
            }
            return boardCache;
        }
        catch (error) {
            logger.error('Failed to get  game board in service:', error);
            return 'Failed to get  game board in service';
        }
    }
    async updateBoard(boardId, fields) {
        try {
            if (!boardId || !fields) {
                throw new Error('Failed get props in update board service');
            }
            let updateBoard = await this.model.findByIdAndUpdate(boardId, fields, { returnDocument: 'after' });
            if (!updateBoard)
                throw new Error('Failed to update fields in board service');
            this.cache.addKeyInCache(boardId, updateBoard);
            return updateBoard;
        }
        catch (error) {
            logger.error('Failed to update fields in board service:', error);
            return 'Failed to update fields in board service';
        }
    }
    async connectBoard(ws, message) {
        try {
            const boardId = getUnicNumber(message.boardId);
            ws.id = boardId;
            const board = await this.getBoardId(message.boardId);
            const cells = await cellService.getAllCells('nep');
            const players = await playerService.getBoardPlayers(board.players);
            const propertys = await propertyService.getAllPropertys(message.boardId);
            if (!board || !cells || !players) {
                throw new Error('Failed to board get data');
            }
            const dice = await diceService.getDiceInBoard(board.dice.toString());
            const auction = await auctionService.getAuctionId(board.auction_id.toString());
            ws.send(JSON.stringify({
                method: 'connectData',
                data: {
                    board,
                    cells,
                    players,
                    dice,
                    propertys,
                    auction,
                }
            }));
            const broadData = {
                method: message.method,
                title: `Пользователь ${message.fullName} подключен`,
            };
            broadcastConnection(boardId, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to connection session:', error);
            return { error, text: 'Failed to connection sessio' };
        }
    }
    async removeBoard(id) {
        try {
            if (!id) {
                throw new Error('Failer to id in remove board');
            }
            await this.model.findByIdAndRemove(id);
            const cacheBoard = this.cache.getValueInKey(id);
            if (cacheBoard) {
                this.cache.removeKeyFromCache(id);
            }
        }
        catch (error) {
            logger.error('Failed to update finished move cell tax:', error);
            return { error, text: 'Failed to update finished move cell tax' };
        }
    }
    async disconectUser(ws, body) {
        try {
        }
        catch (error) {
            logger.error('Failed to disconect user in game board service:', error);
            return { error, text: 'Failed to disconect user in game board service' };
        }
    }
    getGameBoardsCache() {
        return this.cache.getValueInKey(this.allGameBoardKey);
    }
}
