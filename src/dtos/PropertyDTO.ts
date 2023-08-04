import { ICell } from '../types/index.js';

export interface PropertyCheckOwner {
  board_id: string;
  cell_id: string;
  player_id: string;
  cell: ICell;
}
export interface PropertyCreateOwner {
  board_id: string;
  player_id: string;
  cell: ICell;
}
