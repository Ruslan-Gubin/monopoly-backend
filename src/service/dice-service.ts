import { Model } from 'mongoose';
import { DiceModel } from '../models/index.js';
import {  CacheManager, logger, randomValue } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';


export class DiceService {
  private readonly model: Model<types.IDice>;
  private cache: CacheManager<types.IDice>;

  constructor({ cache }: { cache: CacheManager<types.IDice> }) {
    this.model = DiceModel;
    this.cache = cache;
  }

 public async createDice(): Promise<types.IDice | string>  {
    try {
        const newDice = await this.model.create({});

        if (!newDice)  throw new Error('Failed to create dice');
        
        const id = newDice._id.toString();
        this.cache.addKeyInCache(id, newDice);

        return newDice
    } catch (error) {
      logger.error('Failed to create players in service:', error);
      return  'Failed to create players in service' ;
    }
  }

  public async diceUpdate({ dice_id, user_name,  player_id }: DTO.DiceUpdateDTO): Promise<types.IDice | string> {
    try {
      if (!dice_id || !user_name || !player_id) {
        throw new Error('Failed message in dice update service')
      }
  
      const dice1 = 5 
      const dice2 = 4
      // const dice1 = randomValue(1, 6)
      // const dice2 = randomValue(1, 6)

      const diceUpdate = await this.model.findByIdAndUpdate(
        dice_id,
        {
          current_id: player_id,
          dice1,
          dice2,
          value: dice1 + dice2,
          isDouble: true,
          // isDouble: dice1 === dice2,
          user_name,
        },
        { returnDocument: 'after' }
      ) as types.IDice

      this.cache.addKeyInCache(dice_id, diceUpdate)

      return diceUpdate;
    } catch (error) {
      logger.error('Failed to update dice in service:', error);
      return 'Failed to update dice in service';
    }
  }

  public async getDiceInBoard(id: string): Promise<types.IDice | string> {
    try {
      if (!id) {
        throw new Error('Failed id in service')
      }

      let diceCache = this.getDiceCache(id)

      if (!diceCache) {
        diceCache = await this.model.findById(id)
        if (!diceCache) {
          throw new Error('Failed to get dice')
        }
        this.cache.addKeyInCache(id, diceCache)
      }

      return diceCache
    } catch (error) {
      logger.error('Failed to get dice in service:', error);
      return 'Failed to get dice in service' ;
    }
  }

  async deleteAll() {
    const allEntity = await this.model.find({})
    for(const board of allEntity) {
      await this.model.findByIdAndDelete(board._id)
    }
  }

  private getDiceCache(id: string): types.IDice | null {
    return this.cache.getValueInKey(id) as types.IDice | null;
  }
}