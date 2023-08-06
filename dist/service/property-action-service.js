import { GameBoardModel } from '../models/index.js';
import { broadcastConnection, logger, nextPlayerQueue } from '../utils/index.js';
import { playerService, propertyService } from '../handlers/index.js';
export class PropertyActionService {
    constructor({ cache, }) {
        this.model = GameBoardModel;
        this.cache = cache;
    }
    async buyProperty(ws, message) {
        try {
            if (!message) {
                throw new Error('Failed to message or  buy property in service');
            }
            const { board_id, player_id, cell, ws_id, isDouble, players, player_color } = message.body;
            const property = await propertyService.create({ board_id, player_id, cell, player_color });
            if (typeof property === 'string') {
                throw new Error(property);
            }
            const player = await playerService.moneyUpdate(player_id, cell.price, false);
            if (typeof player === 'string') {
                throw new Error(player);
            }
            const currentPlayerId = nextPlayerQueue(players, player_id, isDouble);
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
    async updateProperty(ws, message) {
        try {
            const { player_id, price, property_id, ws_id, player_name, cellName } = message.body;
            const property = await propertyService.updateProperty(property_id);
            const player = await playerService.moneyUpdate(player_id, price, false);
            const broadData = {
                method: message.method,
                title: `Игрок ${player_name} улучшает поле ${cellName}`,
                data: {
                    player,
                    property,
                },
            };
            broadcastConnection(ws_id, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to update finished move cell tax:', error);
            return { error, text: 'Failed to update finished move cell tax' };
        }
    }
    async mortgageProperty(ws, message) {
        try {
            const { player_id, price, property_id, ws_id, player_name, cellName, value } = message.body;
            const property = await propertyService.mortgageUpdateProperty(property_id, value);
            const player = await playerService.moneyUpdate(player_id, price, value);
            const titleText = value ? 'закладывает' : 'выкупает';
            const broadData = {
                method: message.method,
                title: `Игрок ${player_name} ${titleText} поле ${cellName}`,
                data: {
                    player,
                    property,
                },
            };
            broadcastConnection(ws_id, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to update finished move cell tax:', error);
            return { error, text: 'Failed to update finished move cell tax' };
        }
    }
}
