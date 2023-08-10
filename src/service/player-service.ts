import { Model } from 'mongoose';
import { PlayerModel } from '../models/index.js';
import {  CacheManager,  logger } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';


export class PlayerService {
  private readonly model: Model<types.IPlayer>;
  private cache: CacheManager<types.IPlayer | types.IPlayer[]>;

  constructor({ cache }: { cache: CacheManager<types.IPlayer> }) {
    this.model = PlayerModel;
    this.cache = cache;
  }

 public async createPlayers(playersList: DTO.BoardCreateDTO[]): Promise<types.IPlayer[] | string>  {
    try {
      if (!playersList) {
        throw new Error('Failed playersList in create players service');
      }

      const newPlayerList: types.IPlayer[] = []

      for (const player of playersList) {
        const newPlayer = await this.model.create({
          name: player.fullName,
          color: player.color,
          image: player.img,
          user_id: player.id,
        });

        if (!newPlayer)  throw new Error('Failed to create players');
        newPlayerList.push(newPlayer)
        
        const id = newPlayer._id.toString();
        this.cache.addKeyInCache(id, newPlayer);
      }
     
      return newPlayerList
    } catch (error) {
      logger.error('Failed to create players in service:', error);
      return  'Failed to create players in service' ;
    }
  }

  async getBoardPlayers(players: string[]) {
    try {
      if (!players) {
        throw new Error('Failed boardId in get players service');
      }

      const playersBoard = []

      for (const player of players) {
        let playerCache =  this.cache.getValueInKey(player)

        if (!playerCache) {
          playerCache = await this.model.findById(player) as types.IPlayer
          if (!playerCache) {
            throw new Error ('Failed get players id board')
          }
          this.cache.addKeyInCache(player, playerCache)
        }

        playersBoard.push(playerCache)
      }

      return playersBoard
    } catch (error) {
      logger.error('Failed to get players in board service:', error);
      return  'Failed to get players in board service' ;
    }
  }

  async findPlayerId(id: string): Promise<types.IPlayer | string> {
    try {
      if (!id) {
        throw new Error('Failed to id in get player service');
      }

      let playerCache = this.cache.getValueInKey(id)

      if (!playerCache) { 
         playerCache = await this.model.findById(id)
         if (!playerCache) {
          throw new Error('Failed to get player id in db')
         }
         this.cache.addKeyInCache(id, playerCache)
      }

      return playerCache as types.IPlayer
    } catch (error) {
      logger.error('Failed to get player in service:', error);
      return  'Failed to get player in service' ;
    }
  }

  async updatePosition({ player_id, newPosition, previous_position }: DTO.PlayerUpdatePositionDTO): Promise<types.IPlayer | string> {
    try {
      const increment = previous_position > newPosition ? 200 : 0;

      const updatePlayer = await this.model.findByIdAndUpdate(player_id, {
        position: newPosition,
        previous_position,
        $inc: {money: + increment}
      },
      {returnDocument: 'after'} 
      )

      if (!updatePlayer) {
        throw new Error ('Failed get players update board')
      }
      const updatePlayerId = updatePlayer._id.toString()
      this.cache.addKeyInCache(updatePlayerId, updatePlayer)

      return updatePlayer
    } catch (error) {
      logger.error('Failed to update Position service:', error);
      return  'Failed to update Position service' ;
    }
  }

  async moneyUpdate(player_id: string, pay: number, increment: boolean) {
    try {
      const payVariant = increment ? + pay : - pay
      const player = await this.model.findByIdAndUpdate(player_id, {
        $inc: {money: payVariant}
      },{returnDocument: 'after'}) as types.IPlayer

      this.cache.addKeyInCache(player_id, player)
      return player
    } catch (error) {
      logger.error('Failed to update money in players service:', error);
      return  'Failed to update money in players service' ;
    }
  }

  async updateFields(player_id: string, fields: any) {
    try {
      if (!player_id) throw new Error('Failed to id in update Fields player service')
      if (!fields) throw new Error('Failed to fields in update Fields player service')

      const player = await this.model.findByIdAndUpdate(player_id, fields, {returnDocument: 'after'})
      if (!player) throw new Error('Failed to update player fields')

      this.cache.addKeyInCache(player_id, player)
      return player
    } catch (error) {
      logger.error('Failed to set board id in players service:', error);
      return  'Failed to set board id in players service' ;
    }
  }

  async removePlayer(id: string) {
    try {
      if (!id) {
        throw new Error('Failed to id in remove player service')
      }
        await this.model.findByIdAndRemove(id)

        const cachePlayer = this.cache.getValueInKey(id)
        if (cachePlayer) {
          this.cache.removeKeyFromCache(id)
        }
      
    } catch (error) {
      logger.error('Failed to remove players service:', error);
      return  'Failed to remove players service' ;
    }
  }

}