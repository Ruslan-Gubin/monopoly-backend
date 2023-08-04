import { Model } from 'mongoose';
import { PlayerModel } from '../models/index.js';
import {  CacheManager,  logger } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';
import { IPlayer } from '../types/index.js';


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

  async getBoardPlayers(players: IPlayer[]) {
    try {
      if (!players) {
        throw new Error('Failed boardId in get players service');
      }

      const playersBoard = []

      for (const player of players) {
        const playerId = player._id.toString()
        let playerCache =  this.cache.getValueInKey(playerId)

        if (!playerCache) {
          playerCache = await this.model.findById(player._id) as types.IPlayer
          if (!playerCache) {
            throw new Error ('Failed get players id board')
          }
          this.cache.addKeyInCache(playerId, playerCache)
        }

        playersBoard.push(playerCache)
      }

      return playersBoard
    } catch (error) {
      logger.error('Failed to get players in board service:', error);
      return  'Failed to get players in board service' ;
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

  async positionTheatre({ player_id, previous_position }: DTO.PlayerPositionTheatreDTO): Promise<types.IPlayer | string> {
    try {
      const updatePlayer = await this.model.findByIdAndUpdate(player_id, {
        position: 10,
        previous_position,
        in_jail: true,
        current_jail: 4,
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
      logger.error('Failed to update Position theatre service:', error);
      return  'Failed to update Position theatre service' ;
    }
  }

  async updateTheatre({ player_id, isDouble }: DTO.PlayerUpdateTheatreCountDTO): Promise<types.IPlayer | string> {
    try {
      let player = await this.model.findByIdAndUpdate(player_id, {
        $inc: { current_jail: -1 }
      },
      {returnDocument: 'after'} 
      ) as types.IPlayer

      if (!player) {
        throw new Error ('Failed get players update board')
      }

      if (player !== null && player.current_jail === 0 || isDouble) {
        player = await this.model.findByIdAndUpdate(player_id, {
          in_jail: false,
          current_jail: 0,
        },
        {returnDocument: 'after'} 
        ) as types.IPlayer
      }

      this.cache.addKeyInCache(player_id, player)

      return player
    } catch (error) {
      logger.error('Failed to update theatre count service:', error);
      return  'Failed to update theatre count service' ;
    }
  }

  async setBoardIdInPlaers(players: IPlayer[], board_id: string) {
    try {
       for (const player of players) {
      await this.model.findByIdAndUpdate(player._id, { board_id }) 
    }
    } catch (error) {
      logger.error('Failed to set board id in players service:', error);
      return  'Failed to set board id in players service' ;
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
      logger.error('Failed to set board id in players service:', error);
      return  'Failed to set board id in players service' ;
    }
  }

  async deleteAll() {
    const allEntity = await this.model.find({})
    for(const board of allEntity) {
      await this.model.findByIdAndDelete(board._id)
    }
  }

  private getPlayerCache(id: string): types.IPlayer[] | null {
    return this.cache.getValueInKey(id) as types.IPlayer[] | null;
  }
}