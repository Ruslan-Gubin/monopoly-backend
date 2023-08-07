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
                    image: player.img,
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
    async getBoardPlayers(players) {
        try {
            if (!players) {
                throw new Error('Failed boardId in get players service');
            }
            const playersBoard = [];
            for (const player of players) {
                const playerId = player.toString();
                let playerCache = this.cache.getValueInKey(playerId);
                if (!playerCache) {
                    playerCache = await this.model.findById(player);
                    if (!playerCache) {
                        throw new Error('Failed get players id board');
                    }
                    this.cache.addKeyInCache(playerId, playerCache);
                }
                playersBoard.push(playerCache);
            }
            return playersBoard;
        }
        catch (error) {
            logger.error('Failed to get players in board service:', error);
            return 'Failed to get players in board service';
        }
    }
    async updatePosition({ player_id, newPosition, previous_position }) {
        try {
            const increment = previous_position > newPosition ? 200 : 0;
            const updatePlayer = await this.model.findByIdAndUpdate(player_id, {
                position: newPosition,
                previous_position,
                $inc: { money: +increment }
            }, { returnDocument: 'after' });
            if (!updatePlayer) {
                throw new Error('Failed get players update board');
            }
            const updatePlayerId = updatePlayer._id.toString();
            this.cache.addKeyInCache(updatePlayerId, updatePlayer);
            return updatePlayer;
        }
        catch (error) {
            logger.error('Failed to update Position service:', error);
            return 'Failed to update Position service';
        }
    }
    async positionTheatre({ player_id, previous_position }) {
        try {
            const updatePlayer = await this.model.findByIdAndUpdate(player_id, {
                position: 10,
                previous_position,
                in_jail: true,
                current_jail: 4,
            }, { returnDocument: 'after' });
            if (!updatePlayer) {
                throw new Error('Failed get players update board');
            }
            const updatePlayerId = updatePlayer._id.toString();
            this.cache.addKeyInCache(updatePlayerId, updatePlayer);
            return updatePlayer;
        }
        catch (error) {
            logger.error('Failed to update Position theatre service:', error);
            return 'Failed to update Position theatre service';
        }
    }
    async updateTheatre({ player_id, isDouble }) {
        try {
            let player = await this.model.findByIdAndUpdate(player_id, {
                $inc: { current_jail: -1 }
            }, { returnDocument: 'after' });
            if (!player) {
                throw new Error('Failed get players update board');
            }
            if (player !== null && player.current_jail === 0 || isDouble) {
                player = await this.model.findByIdAndUpdate(player_id, {
                    in_jail: false,
                    current_jail: 0,
                }, { returnDocument: 'after' });
            }
            this.cache.addKeyInCache(player_id, player);
            return player;
        }
        catch (error) {
            logger.error('Failed to update theatre count service:', error);
            return 'Failed to update theatre count service';
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
    async moneyUpdate(player_id, pay, increment) {
        try {
            const payVariant = increment ? +pay : -pay;
            const player = await this.model.findByIdAndUpdate(player_id, {
                $inc: { money: payVariant }
            }, { returnDocument: 'after' });
            this.cache.addKeyInCache(player_id, player);
            return player;
        }
        catch (error) {
            logger.error('Failed to set board id in players service:', error);
            return 'Failed to set board id in players service';
        }
    }
    async updateFields(player_id, fields) {
        try {
            const player = await this.model.findByIdAndUpdate(player_id, fields, { returnDocument: 'after' });
            this.cache.addKeyInCache(player_id, player);
            return player;
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
