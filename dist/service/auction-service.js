import { logger } from '../utils/index.js';
import { AuctionModel } from '../models/index.js';
export class AuctionService {
    constructor({ cache }) {
        this.model = AuctionModel;
        this.cache = cache;
    }
    async createAuction() {
        try {
            const newAuction = await this.model.create({});
            if (!newAuction) {
                throw new Error('Failed to create new auction');
            }
            const id = newAuction._id.toString();
            this.cache.addKeyInCache(id, newAuction);
            return newAuction;
        }
        catch (error) {
            logger.error('Failed to create new auction:', error);
            return 'Failed to create new auction';
        }
    }
    async getAuctionId(auction_id) {
        try {
            if (!auction_id) {
                throw new Error('Failed to auction id in get auction');
            }
            let auctionCache = this.cache.getValueInKey(auction_id);
            if (!auctionCache) {
                auctionCache = await this.model.findById(auction_id);
                if (!auctionCache) {
                    throw new Error('Failed to get auction');
                }
                this.cache.addKeyInCache(auction_id, auctionCache);
            }
            return auctionCache;
        }
        catch (error) {
            logger.error('Failed to create new auction:', error);
            return 'Failed to create new auction';
        }
    }
    async updateAuction(auction_id, fields) {
        try {
            if (!auction_id || !fields) {
                throw new Error('Failed to props in update auction');
            }
            const updateAuction = await this.model.findByIdAndUpdate(auction_id, fields, { returnDocument: 'after' });
            if (!updateAuction) {
                throw new Error('Failed to update fields in auction');
            }
            this.cache.addKeyInCache(auction_id, updateAuction);
            return updateAuction;
        }
        catch (error) {
            logger.error('Failed to update fields auction:', error);
            return 'Failed to update fields auction';
        }
    }
    async removeAuction(auction_id) {
        try {
            if (!auction_id) {
                throw new Error('Failed to id in remove auction');
            }
            await this.model.findByIdAndDelete(auction_id);
            const cacheAuction = this.cache.getValueInKey(auction_id);
            if (cacheAuction) {
                this.cache.removeKeyFromCache(auction_id);
            }
        }
        catch (error) {
            logger.error('Failed to remove auction:', error);
            return 'Failed to remove auction';
        }
    }
}
