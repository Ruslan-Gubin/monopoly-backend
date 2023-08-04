import { GameBoardModel } from '../models/index.js';
import { broadcastConnection, logger, randomValue, getUnicNumber, checkCellType, chanceCards, lotteryCards } from '../utils/index.js';
import { SESSION_ID } from '../config/web-socked.js';
import { cellService, diceService, playerService, propertyService } from '../handlers/index.js';
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
            const chanse_current = randomValue(1, 16);
            const lottery_current = randomValue(1, 9);
            const newBoard = await this.model.create({
                currentPlayerId: newPlayers[randomPlayer]._id,
                players: newPlayers,
                dice: newDice,
                chanse_current,
                lottery_current
            });
            if (!newBoard)
                throw new Error('Failed create board in service');
            const boardId = getUnicNumber(newBoard._id);
            const updateBoard = await this.model.findByIdAndUpdate(newBoard._id, {
                ws_id: boardId
            }, { returnDocument: 'after' });
            await playerService.setBoardIdInPlaers(newPlayers, newBoard._id);
            const id = updateBoard._id.toString();
            this.cache.addKeyInCache(id, updateBoard);
            const broadData = {
                method: 'createGameBoard',
                title: `Игроки ${playersNameList} перемещаются на игровое поле`,
                board_id: updateBoard._id,
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
            return { error, text: 'Failed to get  game board in service' };
        }
    }
    async deleteAll() {
        const allEntity = await this.model.find({});
        for (const board of allEntity) {
            await this.model.findByIdAndDelete(board._id);
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
        }
        catch (error) {
            logger.error('Failed to connection session:', error);
            return { error, text: 'Failed to connection sessio' };
        }
    }
    async finishedMove(ws, message) {
        try {
            if (!message) {
                throw new Error('Failed message in finished move');
            }
            const { board_id, isDouble, newPosition, player_id, player_money, player_name, previous_position, cell_id, players, property_id, cell } = message.body;
            const boardId = getUnicNumber(board_id);
            const player = await playerService.updatePosition({
                player_id,
                newPosition,
                previous_position,
            });
            let board = await this.getBoardId(board_id);
            if (typeof player === 'string' || !cell || !board) {
                throw new Error('Failed get cell or playerUpdate in board');
            }
            const cellType = checkCellType(cell.type);
            switch (cellType) {
                case 'property':
                    await this.moveFinishProperty(boardId, ws, message, cell, player);
                    break;
                case 'action':
                    await this.moveFinishAction(boardId, ws, message, cell);
                    break;
                case 'tax':
                    await this.moveFinishTax(boardId, ws, message, cell, player, newPosition, cell_id);
                    break;
                case 'corner':
                    await this.moveFinishCorner(boardId, ws, message, cell, player);
                    break;
            }
        }
        catch (error) {
            logger.error('Failed to update  in finished move:', error);
            return { error, text: 'Failed to  player in finished move' };
        }
    }
    async moveFinishProperty(boardId, ws, message, cell, player) {
        try {
            const { property_id, cell, board_id, cell_id, isDouble, newPosition, player_id, player_name, players, previous_position } = message.body;
            const checkProperty = await propertyService.checkProperty({ board_id, cell_id, player_id, cell });
            if (typeof checkProperty === 'string') {
                throw new Error(checkProperty);
            }
            const { canBuy, myProperty, rent, isMortgage } = checkProperty;
            let currentPlayerId = player_id;
            let action = 'start move';
            let price = 0;
            if (canBuy) {
                action = 'can buy';
                price = cell.price;
            }
            if (myProperty || isMortgage) {
                currentPlayerId = this.nextPlayerQueue(players, player_id, isDouble);
            }
            if (!myProperty && rent > 0) {
                action = 'need pay';
                price = rent;
            }
            const board = await this.model.findByIdAndUpdate(message.body.board_id, {
                currentPlayerId,
                action,
                price,
                currentCellPosition: newPosition,
                currentCellId: cell_id,
            }, { returnDocument: 'after' });
            this.cache.addKeyInCache(board_id, board);
            const broadData = {
                method: message.method,
                title: `Игрок ${player.name} останавливается на ${cell.name}`,
                data: {
                    board,
                    player,
                },
            };
            broadcastConnection(boardId, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to update finished move cell corner:', error);
            return { error, text: 'Failed to update finished move cell corner' };
        }
    }
    async buyProperty(ws, message) {
        try {
            if (!message) {
                throw new Error('Failed to message or  buy property in service');
            }
            const { board_id, player_id, cell, ws_id, isDouble, players } = message.body;
            const property = await propertyService.create({ board_id, player_id, cell });
            if (typeof property === 'string') {
                throw new Error(property);
            }
            const player = await playerService.moneyUpdate(player_id, cell.price, false);
            if (typeof player === 'string') {
                throw new Error(player);
            }
            const currentPlayerId = this.nextPlayerQueue(players, player_id, isDouble);
            const board = await this.model.findByIdAndUpdate(board_id, {
                currentPlayerId,
                action: 'start move',
                price: 0,
            }, { returnDocument: 'after' });
            this.cache.addKeyInCache(board_id, board);
            const broadData = {
                method: message.method,
                title: `Игрок: ${player.name} покупает ${cell.name}`,
                data: {
                    player,
                    property: property.property,
                    manyProperty: property.manyUpdates,
                    board,
                },
            };
            broadcastConnection(ws_id, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to  buy property  in service:', error);
            return { error, text: 'Failed to  buy property  in service' };
        }
    }
    async moveFinishCorner(boardId, ws, message, cell, player) {
        try {
            const { board_id, cell_id, isDouble, newPosition, player_id, player_name, players, previous_position } = message.body;
            let title = `Игрок: ${player_name} останавливается на поле ${cell.name}`;
            let currentPlayer = player;
            if (cell.type === 'visit theater') {
                currentPlayer = await playerService.positionTheatre({
                    player_id,
                    previous_position,
                });
                title = `Игрок: ${player_name} перемещается на поле театр`;
            }
            const currentPlayerId = this.nextPlayerQueue(players, player_id, isDouble);
            const board = await this.model.findByIdAndUpdate(message.body.board_id, {
                currentPlayerId,
                action: 'start move',
                currentCellPosition: newPosition,
                currentCellId: cell_id,
            }, { returnDocument: 'after' });
            this.cache.addKeyInCache(board_id, board);
            const broadData = {
                method: message.method,
                title,
                data: {
                    board,
                    player: currentPlayer,
                },
            };
            broadcastConnection(boardId, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to update finished move cell corner:', error);
            return { error, text: 'Failed to update finished move cell corner' };
        }
    }
    async moveFinishAction(boardId, ws, message, cell) {
        try {
            const { board_id, cell_id, isDouble, newPosition, player_id, player_money, player_name, players, previous_position, chanse_current, lottery_current } = message.body;
            let chanceCurrent = chanse_current;
            let lotteryCurrent = lottery_current;
            let actionCard = null;
            if (cell.type === 'action-chance') {
                chanceCurrent = chanse_current >= 16 ? 1 : chanceCurrent + 1;
                actionCard = chanceCards.get(chanceCurrent);
            }
            else {
                lotteryCurrent = lottery_current >= 9 ? 1 : lotteryCurrent + 1;
                actionCard = lotteryCards.get(lotteryCurrent);
            }
            if (!actionCard) {
                throw new Error('Failed to action card');
            }
            const price = !actionCard.increment ? actionCard.price : 0;
            const action = !actionCard.increment ? 'need pay' : 'start move';
            const currentPlayerId = !actionCard.increment ? player_id : this.nextPlayerQueue(players, player_id, isDouble);
            const board = await this.model.findByIdAndUpdate(message.body.board_id, {
                currentPlayerId,
                action,
                currentCellPosition: newPosition,
                currentCellId: cell_id,
                chanse_current: chanceCurrent,
                lottery_current: lotteryCurrent,
                price,
            }, { returnDocument: 'after' });
            this.cache.addKeyInCache(board_id, board);
            const player = await playerService.moneyUpdate(player_id, actionCard.price, actionCard.increment);
            const broadData = {
                method: message.method,
                title: actionCard.text,
                data: {
                    board,
                    player,
                },
            };
            broadcastConnection(boardId, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to update finished move cell action:', error);
            return { error, text: 'Failed to update finished move cell action' };
        }
    }
    async moveFinishTax(boardId, ws, message, cell, player, newPosition, cell_id) {
        try {
            const board = await this.model.findByIdAndUpdate(message.body.board_id, {
                action: 'need pay',
                price: cell.price,
                currentCellPosition: newPosition,
                currentCellId: cell_id,
            }, { returnDocument: 'after' });
            this.cache.addKeyInCache(message.body.board_id, board);
            const broadData = {
                method: message.method,
                title: `Игроку: ${message.body.player_name} придется оплатить налог в размере ${cell.price}`,
                data: {
                    board,
                    player,
                },
            };
            broadcastConnection(boardId, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to update finished move cell tax:', error);
            return { error, text: 'Failed to update finished move cell tax' };
        }
    }
    async payPrice(ws, message) {
        try {
            const { board_id, player_id, price, isDouble, player_name, players } = message.body;
            const boardId = getUnicNumber(board_id);
            const nexPlayerId = this.nextPlayerQueue(players, player_id, isDouble);
            const board = await this.model.findByIdAndUpdate(board_id, {
                currentPlayerId: nexPlayerId,
                action: 'start move',
                price: 0,
            }, { returnDocument: 'after' });
            this.cache.addKeyInCache(board_id, board);
            const player = await playerService.moneyUpdate(player_id, price, false);
            const broadData = {
                method: message.method,
                title: `Игрок ${player_name} оплачивает: ${price} руб`,
                data: {
                    board,
                    player,
                },
            };
            broadcastConnection(boardId, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to update finished move cell tax:', error);
            return { error, text: 'Failed to update finished move cell tax' };
        }
    }
    nextPlayerQueue(players, player_id, isDouble) {
        const current = players.findIndex(player => player === player_id);
        if (isDouble) {
            return players[current];
        }
        return current + 1 >= players.length ? players[0] : players[current + 1];
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
