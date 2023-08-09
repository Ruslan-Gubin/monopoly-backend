import { ICell } from '../types/index.js';

export interface PropertyCheckOwner {
  board_id: string;
  cell_id: string;
  player_id: string;
  cell_rent: number[];
  property_id: string | null;
}
export interface PropertyCheckOwnerResult {
  myProperty: boolean;
  canBuy: boolean;
  rent: number;
  isMortgage: boolean;
}
export interface PropertyCreateOwner {
  board_id: string;
  player_id: string;
  cell: ICell;
  player_color: string;
}
