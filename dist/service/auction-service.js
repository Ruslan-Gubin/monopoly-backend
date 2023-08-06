import { GameBoardModel } from '../models/index.js';
import { logger, } from '../utils/index.js';
export class AuctionService {
    constructor({ cache, }) {
        this.model = GameBoardModel;
        this.cache = cache;
    }
    async auctionRefresh(ws, message) {
        try {
            const { cell_name, player_name, property_price, ws_id } = message.body;
            console.log(cell_name, player_name, property_price, ws_id);
        }
        catch (error) {
            logger.error('Failed to update finished move cell tax:', error);
            return { error, text: 'Failed to update finished move cell tax' };
        }
    }
}
