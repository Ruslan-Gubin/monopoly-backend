import { PlayerModel } from '../models/index.js';
import { logger } from '../utils/index.js';
export class PlayerService {
    constructor({ cache }) {
        this.model = PlayerModel;
        this.cache = cache;
    }
    async createPlayers(playersList) {
        try {
            if (!playersList) {
                throw new Error('Failed playersList in create players service');
            }
            const newPlayerList = [];
            for (const player of playersList) {
                const newPlayer = await this.model.create({
                    name: player.fullName,
                    color: player.color,
                    img: player.img,
                    user_id: player.id,
                });
                if (!newPlayer)
                    throw new Error('Failed to create players');
                newPlayerList.push(newPlayer);
                const id = newPlayer._id.toString();
                this.cache.addKeyInCache(id, newPlayer);
            }
            return newPlayerList;
        }
        catch (error) {
            logger.error('Failed to create players in service:', error);
            return 'Failed to create players in service';
        }
    }
    async getBoardPlayers(boardId) {
        try {
            if (!boardId) {
                throw new Error('Failed boardId in get players service');
            }
            let playersInboardCache = (this.cache.getValueInKey(`players-board${boardId}`));
            if (!playersInboardCache) {
                playersInboardCache = await this.model.find({ board_id: boardId });
                this.cache.addKeyInCache(`players-board${boardId}`, playersInboardCache);
            }
            return playersInboardCache;
        }
        catch (error) {
            logger.error('Failed to get players in board service:', error);
            return 'Failed to get players in board service';
        }
    }
    async setBoardIdInPlaers(players, board_id) {
        try {
            for (const player of players) {
                await this.model.findByIdAndUpdate(player._id, { board_id });
            }
        }
        catch (error) {
            logger.error('Failed to set board id in players service:', error);
            return 'Failed to set board id in players service';
        }
    }
    async deleteAll() {
        const allEntity = await this.model.find({});
        for (const board of allEntity) {
            await this.model.findByIdAndDelete(board._id);
        }
    }
    getPlayerCache(id) {
        return this.cache.getValueInKey(id);
    }
}
