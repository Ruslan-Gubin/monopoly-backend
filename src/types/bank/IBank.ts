import { Document } from '../Document/index.js';

export interface IBank extends Document {
  money: number; //количество денег в банке
  properties: string[] // список доступной для покупки недвижимости
  actionCards: string[]; // список доступных действий (карточек) для общественной казны и шанса
  houses: number; // количество доступных домов
  hotels: number; // количество доступных отелей
  board_id: string; // id игровой доски
}