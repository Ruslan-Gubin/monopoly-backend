import { Document } from '../Document/index.js';
import { ICell, IPlayer } from '../index.js';


export interface IProperty  extends Document {
  cell_id: ICell;
  owner: IPlayer;
  price: number;
  rent: number[];
  current_rent: number;
  is_sindicate: boolean;
  house_count: number;
  mortgage_price: number;
  buy_back: number;
}