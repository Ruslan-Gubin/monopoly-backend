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
