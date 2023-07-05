import { Document } from '../Document/index.js';

export interface IDice extends Document {
  player_id: string; // активный игрок
  dice1: number; // выпавшее значение на игровом кубике
  dice2: number; // выпавшее значение на игровом кубике
  value: number; // общее значение на кубиков
  prev_value: number; // предыдущее значение на игровом кубике
  prev_player: string; // id последнего игрока
  board_id: string; // id игровой доски
  isDouble: boolean; // выпало ли игроку две одинаковые грани
}