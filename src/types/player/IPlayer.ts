import { IGameBoard, IUser } from '../index.js';
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
   * Флаг, указывающий, находится ли игрок в тюрьме.
   * @type {boolean}
   */
  in_jail: boolean; 
  /**
   * Количество ходов для освобождения.
   * @type {number}
   */
  current_jail: number; 
  /**
   * Цвет игровой фишки.
   * @type {string}
   */
  color: string;  
  /**
   * Фото игрока.
   * @type { string }
   */
  image: string;  
  /**
   * ID пользователя.
   * @type { string }
   */
  user_id: IUser; 
  /**
   * ID игровой доски.
   * @type { IGameBoard }
   */
  board_id: IGameBoard;  
}



