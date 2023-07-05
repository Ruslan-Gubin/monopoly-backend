import { IProperty } from '../index.js';
import { Document } from '../Document/index.js'

/**
 * Интерфейс игрока.
 * @interface IPlayer
 * @extends {Document}
 */
export interface IPlayer extends Document {
  /**
   * Имя игрока.
   * @type {string}
   */
  name: string;
  /**
   * Позиция на поле.
   * @type {number}
   */
  position: number;
  /**
   * Флаг, указывающий, является ли игрок активным или проигравшим.
   * @type {boolean}
   */
  is_active: boolean; 
  /**
   * Количество денег у игрока.
   * @type {number}
   */
  money: number; 
  /**
   * Список недвижимости, принадлежащей игроку.
   * @type { IProperty[] }
   */
  properties: IProperty[]; 
  /**
   * Флаг, указывающий, находится ли игрок в тюрьме.
   * @type {boolean}
   */
  in_jail: boolean; 
   /**
   * Количество карточек "Выход из тюрьмы".
   * @type {number}
   */
  getOutOfJailCards: number; 
  /**
   * ID игровой доски.
   * @type {string}
   */
  board_id: string;  
}



