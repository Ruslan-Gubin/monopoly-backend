import { DiceModel } from '../models/index.js';
import { logger, randomValue } from '../utils/index.js';
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
    async diceUpdate({ dice_id, fields }) {
        try {
            if (!dice_id) {
                throw new Error('Failed id in props dice update service');
            }
            else if (typeof fields === 'string') {
                throw new Error('Failed fields props in dice update service');
            }
            const diceUpdate = await this.model.findByIdAndUpdate(dice_id, fields, { returnDocument: 'after' });
            this.cache.addKeyInCache(dice_id, diceUpdate);
            return diceUpdate;
        }
        catch (error) {
            logger.error('Failed to update dice in service:', error);
            return 'Failed to update dice in service';
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
    async removeDice(id) {
        try {
            if (!id) {
                throw new Error('Failed id in remove dice service');
            }
            await this.model.findByIdAndDelete(id);
            const cacheDice = this.cache.getValueInKey(id);
            if (cacheDice) {
                this.cache.removeKeyFromCache(id);
            }
        }
        catch (error) {
            logger.error('Failed to get dice in service:', error);
            return 'Failed to get dice in service';
        }
    }
    roolUpdateFields(player_id) {
        try {
            if (!player_id) {
                throw new Error('Failed player id in get rool update fields dice service');
            }
            const dice1 = randomValue(1, 6);
            const dice2 = randomValue(1, 6);
            return {
                dice1,
                dice2,
                value: dice1 + dice2,
                isDouble: dice1 === dice2,
                current_id: player_id,
            };
        }
        catch (error) {
            logger.error('Failed to get update fields dice in service:', error);
            return 'Failed to get update fields dice in service';
        }
    }
    getDiceCache(id) {
        return this.cache.getValueInKey(id);
    }
}
