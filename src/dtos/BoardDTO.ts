import { ICell } from "../types/index.js";

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

export interface BoardFinishedMoveDTO {
  method: string;
  body: {
    player_id: string;
    player_name: string;
    board_id: string;
    previous_position: number;
    player_money: number;
    isDouble: boolean;
    newPosition: number;
    cell_id: string;
    players: string[];
    lottery_current: number,
    chanse_current: number,
    property_id: string | null,
    cell: ICell
  };
}

/** Данные при покупке собственности */
export interface BoardBuyPropertyDTO {
  method: string
  body: {
    /** ID игровой доски*/
    board_id: string,
    /** ID владельца */
    player_id: string,
    /** Ячейка */
    cell: ICell,
    /** ID для веб сокета */
    ws_id: number,
    /** Список игроков для определения очереди */
    players: string[],
    /** был ли дубль */
    isDouble: boolean,
  }
}

/** Данные оплаты налога */
export interface BoardPayTaxDTO {
  method: string
  body: {
    /** ID игровой доски*/
    board_id: string,
    /** ID текющего игрока */
    player_id: string, 
    /** Нужная сумма к уплате */
    price: number, 
    /** был ли дубль */
    isDouble: boolean, 
    /** Список игроков */
    players: string[], 
    /** Имя текущего игрока */
    player_name: string, 
  
  }
}
