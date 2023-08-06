import { Model } from 'mongoose';
import { PropertyModel } from '../models/index.js';
import {  CacheManager,  checkSindicate,  logger } from '../utils/index.js';
import * as DTO from '../dtos/index.js';
import * as types from '../types/index.js';


export class PropertyService {
  private readonly model: Model<types.IProperty>;
  private cache: CacheManager<types.IProperty>;

  constructor({ cache }: { cache: CacheManager<types.IProperty> }) {
    this.model = PropertyModel;
    this.cache = cache;
  }

 public async create({ board_id, cell, player_id, player_color }: DTO.PropertyCreateOwner): Promise<{ property: types.IProperty, manyUpdates: types.IProperty[]}| string>  {
    try {
      if (!board_id || !cell || !player_id || !player_color) {
        throw new Error('Failed to props in create property service');
      }
      let property;
      let manyUpdates;

      if (cell.type === 'property') {
      const propertys = await this.createProperty({ board_id, cell, player_id, player_color }) 
      if (typeof propertys === 'string') throw new Error(propertys)
      const { manyUpdate, newProperty } = propertys
      property = newProperty
      manyUpdates = manyUpdate
      } 

      if (cell.type === 'port') {
      const propertys = await this.createPort({ board_id, cell, player_id, player_color })
      if (typeof propertys === 'string') throw new Error(propertys)
      const { manyUpdate, newProperty } = propertys
      property = newProperty
      manyUpdates = manyUpdate
      }

      if (cell.type.includes('utilities')) {
      const propertys = await this.createUtilities({ board_id, cell, player_id, player_color })
      if (typeof propertys === 'string') throw new Error(propertys)
      const { manyUpdate, newProperty } = propertys
      property = newProperty
      manyUpdates = manyUpdate
      }

      if (!property || !manyUpdates) {
        throw new Error('Failed update propertyes')
      }


      return { property, manyUpdates }
    } catch (error) {
      logger.error('Failed to create property in service:', error);
      return  'Failed to create property in service' ;
    }
  }

  async createProperty({ board_id, cell, player_id, player_color }: DTO.PropertyCreateOwner): Promise<{ newProperty: types.IProperty, manyUpdate: types.IProperty[] } | string> {
    try {
      if (!board_id || !cell || !player_id) {
        throw new Error('Failed to props in create property service');
      }
        let sindicate = true
        let currentRent = 1

        const sindicateList = checkSindicate(cell.position)
        if (!sindicateList) {
          throw new Error('Failed to sindicate list')
        }

        const updateSindicateProperty: types.IProperty[] = []

        for (const position of sindicateList) {
          const checkPosition = await this.model.findOne({
            board_id,
            owner: player_id,
            position,
          }) as types.IProperty
          if (!checkPosition) {
            sindicate = false
            currentRent = 0 
          } else {
            updateSindicateProperty.push(checkPosition)
          }
        }

        const manyUpdate: types.IProperty[] = []

        if (sindicate) {
          for (const property of updateSindicateProperty) {
            const propertyUpdate = await this.model.findByIdAndUpdate(
              property._id,
              { is_sindicate: true, current_rent: 1 },
              { returnDocument: 'after' },
            ) as types.IProperty

            const id = propertyUpdate._id.toString();
            this.cache.addKeyInCache(id, propertyUpdate);
            manyUpdate.push(propertyUpdate)
          }
        }

        const newProperty = await this.model.create({
          cell_id: cell._id,
          board_id: board_id,
          owner: player_id,
          mortgage_price: cell.mortgage_value,
          buy_back: cell.price,
          position: cell.position, 
          current_rent: currentRent, 
          is_sindicate: sindicate,
          player_color,
        });

        if (!newProperty)  throw new Error('Failed to create property');

        const id = newProperty._id.toString();
        this.cache.addKeyInCache(id, newProperty);

      return { newProperty, manyUpdate }
    } catch (error) {
      logger.error('Failed to create property in service:', error);
      return  'Failed to create property in service' ;
    }
  }

  async createPort({ board_id, cell, player_id, player_color }: DTO.PropertyCreateOwner): Promise<{ newProperty: types.IProperty, manyUpdate: types.IProperty[]} | string> {
    try {
      if (!board_id || !cell || !player_id) {
        throw new Error('Failed to props in create property service');
      }
        const portPositionList = [8, 18, 28, 38]
        let port_count = 1

        const updatePorts: types.IProperty[] = []

        for (const position of portPositionList) {
          if (cell.position === position) {
            continue;
          }

          const checkPosition = await this.model.findOne({
            board_id,
            owner: player_id,
            position,
          })
          if (checkPosition) {
            port_count++;
            updatePorts.push(checkPosition)
          }
        }

        const manyUpdate: types.IProperty[] = []

        for (const port of updatePorts) {
        const portProperty =  await this.model.findByIdAndUpdate(
            port._id, 
            { port_count, current_rent: port_count -1 },
            { returnDocument: 'after' },
          ) as types.IProperty

          const id = portProperty._id.toString();
          this.cache.addKeyInCache(id, portProperty);
          manyUpdate.push(portProperty)
        }

        const newProperty = await this.model.create({
          cell_id: cell._id,
          board_id: board_id,
          owner: player_id,
          mortgage_price: cell.mortgage_value,
          buy_back: cell.price,
          position: cell.position,
          current_rent: port_count -1,
          port_count,
          player_color,
        });

        if (!newProperty)  throw new Error('Failed to create property');

        const id = newProperty._id.toString();
        this.cache.addKeyInCache(id, newProperty);

      return { newProperty, manyUpdate }
    } catch (error) {
      logger.error('Failed to create property in service:', error);
      return  'Failed to create property in service' ;
    }
  }

  async createUtilities({ board_id, cell, player_id, player_color }: DTO.PropertyCreateOwner): Promise<{ newProperty: types.IProperty, manyUpdate: types.IProperty[]} | string> {
    try {
      if (!board_id || !cell || !player_id) {
        throw new Error('Failed to props in create property service');
      }
        const utilitiesPositionList = [15, 23]
        let utiletes_count = 1

        const updateUtilities: types.IProperty[] = []

        for (const position of utilitiesPositionList) {
          if (cell.position === position) {
            continue;
          }

          const checkPosition = await this.model.findOne({
            board_id,
            owner: player_id,
            position,
          })
          if (checkPosition) {
            utiletes_count++;
            updateUtilities.push(checkPosition)
          }
        }

        const manyUpdate: types.IProperty[] = []

        for (const utilities of updateUtilities) {
        const utilitiesProperty =  await this.model.findByIdAndUpdate(
            utilities._id, 
            { utiletes_count, current_rent: utiletes_count -1 },
            { returnDocument: 'after' },
          ) as types.IProperty

          const id = utilitiesProperty._id.toString();
          this.cache.addKeyInCache(id, utilitiesProperty);
          manyUpdate.push(utilitiesProperty)
        }

        const newProperty = await this.model.create({
          cell_id: cell._id,
          board_id: board_id,
          owner: player_id,
          mortgage_price: cell.mortgage_value,
          buy_back: cell.price,
          position: cell.position,
          current_rent: utiletes_count -1,
          utiletes_count,
          player_color,
        });

        if (!newProperty)  throw new Error('Failed to create property');

        const id = newProperty._id.toString();
        this.cache.addKeyInCache(id, newProperty);

      return { newProperty, manyUpdate }
    } catch (error) {
      logger.error('Failed to create property in service:', error);
      return  'Failed to create property in service' ;
    }
  }

  async checkProperty({ board_id, cell_id, player_id, cell }: DTO.PropertyCheckOwner) {
    try {
      if (!board_id || !cell_id || !player_id) {
        throw new Error('Failed check owner props');
      }

      let myProperty = false // чья собственность
      let canBuy = false  // доступная покупка
      let rent = 0 // необходимая аренда
      let isMortgage = false // заложенная собственность

      const property = await this.model.findOne({
        cell_id,
        board_id,
      }) as types.IProperty

      if (!property) {
        canBuy = true
      } else { 
        myProperty =  property.owner === player_id
        rent = myProperty ? 0  : cell.rent[property.current_rent]
        isMortgage = property.is_mortgage 
      }

      return {
        myProperty,
        canBuy,
        rent,
        isMortgage,
      }
    } catch (error) {
      logger.error('Failed to check property in property service:', error);
      return  'Failed to check property in property service' ;
    }
  }

  async getAllPropertys( board_id: string) {
    try {
      if (!board_id) {
        throw new Error('Failed board id in get all propertys');
      }
      const propertys = await this.model.find({ board_id })

      if (!propertys) {
        throw new Error('Failed to get all property')
      }

      return propertys
    } catch (error) {
      logger.error('Failed to get all propertys in service:', error);
      return  'Failed to get all propertys in service' ;
    }
  }

  async updateProperty(property_id: string): Promise<types.IProperty | string> {
    try {
      if (!property_id) {
        throw new Error('Failed to props property id in update property')
      }

      const updateProperty = await this.model.findByIdAndUpdate(property_id, {
        $inc: { current_rent: + 1, house_count: + 1 }
      },
      {returnDocument: 'after'}
      )

      if (!updateProperty) {
        throw new Error ('Failed update property')
      }

      this.cache.addKeyInCache(property_id, updateProperty)

      return updateProperty
    } catch (error) {
      logger.error('Failed to update Position service:', error);
      return  'Failed to update Position service' ;
    }
  }

  async mortgageUpdateProperty(property_id: string, value: boolean): Promise<types.IProperty | string> {
    try {
      if (!property_id) {
        throw new Error('Failed to props property id in update property')
      }

      const updateProperty = await this.model.findByIdAndUpdate(property_id, {
        is_mortgage: value,
      },
      {returnDocument: 'after'}
      )

      if (!updateProperty) {
        throw new Error ('Failed update property')
      }

      this.cache.addKeyInCache(property_id, updateProperty)

      return updateProperty
    } catch (error) {
      logger.error('Failed to update Position service:', error);
      return  'Failed to update Position service' ;
    }
  }

}