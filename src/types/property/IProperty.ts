import { Document } from '../Document/index.js';
import { ICell, IGameBoard } from '../index.js';


export interface IProperty  extends Document {
  cell_id: ICell;
  board_id: IGameBoard;
  owner: string;
  current_rent: number;
  is_sindicate: boolean;
  house_count: number;
  mortgage_price: number;
  is_mortgage: boolean;
  position: number;
  port_count: number;
  utiletes_count: number;
  player_color: string;
}

