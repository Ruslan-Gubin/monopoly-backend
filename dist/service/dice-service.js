import { DiceModel } from '../models/index.js';
import { broadcastConnection, getUnicNumber, logger, randomValue } from '../utils/index.js';
import { playerService } from '../handlers/index.js';
export class DiceService {
    constructor({ cache }) {
        this.model = DiceModel;
        this.cache = cache;
    }
    async createDice() {
        try {
            const newDice = await this.model.create({});
            if (!newDice)
                throw new Error('Failed to create dice');
            const id = newDice._id.toString();
            this.cache.addKeyInCache(id, newDice);
            return newDice;
        }
        catch (error) {
            logger.error('Failed to create players in service:', error);
            return 'Failed to create players in service';
        }
    }
    async diceUpdate(ws, message) {
        try {
            if (!message) {
                throw new Error('Failed message in dice update service');
            }
            const { board_id, current_id, dice_id, user_name, in_jail, player_id } = message.body;
            const boardId = getUnicNumber(board_id);
            const dice1 = randomValue(1, 6);
            const dice2 = randomValue(1, 6);
            let value = dice1 + dice2;
            if (in_jail) {
                const player = await playerService.updateTheatre({ player_id, isDouble: dice1 === dice2 });
                if (typeof player === 'string') {
                    throw new Error('Failed update jail count');
                }
                value = player.in_jail ? 0 : dice1 + dice2;
            }
            const diceUpdate = await this.model.findByIdAndUpdate(dice_id, {
                current_id,
                dice1,
                dice2,
                value,
                isDouble: dice1 === dice2,
                user_name,
            }, { returnDocument: 'after' });
            this.cache.addKeyInCache(dice_id, diceUpdate);
            const broadData = {
                method: message.method,
                title: `Игрок: ${user_name} выкидывает ${dice1} и ${dice2}`,
                data: {
                    dice: diceUpdate
                }
            };
            broadcastConnection(boardId, ws, broadData);
        }
        catch (error) {
            logger.error('Failed to update dice in service:', error);
            return { error, text: 'Failed to update dice in service' };
        }
    }
    async getDiceInBoard(id) {
        try {
            if (!id) {
                throw new Error('Failed id in service');
            }
            let diceCache = this.getDiceCache(id);
            if (!diceCache) {
                diceCache = await this.model.findById(id);
                if (!diceCache) {
                    throw new Error('Failed to get dice');
                }
                this.cache.addKeyInCache(id, diceCache);
            }
            return diceCache;
        }
        catch (error) {
            logger.error('Failed to get dice in service:', error);
            return 'Failed to get dice in service';
        }
    }
    async deleteAll() {
        const allEntity = await this.model.find({});
        for (const board of allEntity) {
            await this.model.findByIdAndDelete(board._id);
        }
    }
    getDiceCache(id) {
        return this.cache.getValueInKey(id);
    }
}
