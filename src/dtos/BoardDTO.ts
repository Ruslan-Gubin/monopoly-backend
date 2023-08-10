import { ICell } from '../types/index.js';

export interface BoardCreateDTO {
  id: string;
  fullName: string;
  img: string;
  color: string;
}
export interface ConnectBoardDTO {
  fullName: string;
  id: string;
  method: string;
  boardId: string;
}

/** Данные при покупке собственности */
export interface BoardBuyPropertyDTO {
  method: string;
  body: {
    /** ID игровой доски*/
    board_id: string;
    /** ID владельца */
    player_id: string;
    /** Ячейка */
    cell: ICell;
    /** ID для веб сокета */
    ws_id: number;
    /** Список игроков для определения очереди */
    players: string[];
    /** был ли дубль */
    isDouble: boolean;
    /** Цвет владельца */
    player_color: string;
  };
}

/** Данные оплаты налога */
export interface BoardPayTaxDTO {
  method: string;
  body: {
    /** ID игровой доски*/
    board_id: string;
    /** ID текющего игрока */
    player_id: string;
    /** Нужная сумма к уплате */
    price: number;
    /** был ли дубль */
    isDouble: boolean;
    /** Список игроков */
    players: string[];
    /** Имя текущего игрока */
    player_name: string;
    /** ID владельца собственности (кому пойдет оплата) */
    propertyOwnerId: string | undefined;
    /** ID веб сокета */
    ws_id: number;
  };
}
export interface UpdateDiceDTO {
  method: string;
  body: {
    dice_id: string;
    board_id: string;
    user_name: string;
    in_jail: boolean;
    player_id: string;
    ws_id: number;
    players: string[];
    current_jail: number;
  };
}
export interface UpdatePropertyDTO {
  method: string;
  body: {
    ws_id: number;
    property_id: string;
    player_id: string;
    price: number;
    player_name: string;
    cellName: string;
    value: boolean;
  };
}
export interface GameSendMessageDTO {
  method: string;
  body: {
    player_name: string;
    ws_id: number;
    text: string;
  };
}
