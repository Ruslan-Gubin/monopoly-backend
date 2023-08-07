import { DiceModel } from '../models/index.js';
import { logger } from '../utils/index.js';
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
    async diceUpdate({ dice_id, user_name, player_id }) {
        try {
            if (!dice_id || !user_name || !player_id) {
                throw new Error('Failed message in dice update service');
            }
            const dice1 = 10;
            const dice2 = 10;
            const diceUpdate = await this.model.findByIdAndUpdate(dice_id, {
                current_id: player_id,
                dice1,
                dice2,
                value: dice1 + dice2,
                isDouble: true,
                user_name,
            }, { returnDocument: 'after' });
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
    getDiceCache(id) {
        return this.cache.getValueInKey(id);
    }
}
