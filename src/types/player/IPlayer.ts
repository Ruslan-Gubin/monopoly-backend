import { IGameBoard, IProperty, IUser } from '../index.js';
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
   * Предыдущая позиция на поле.
   * @type {number}
   */
  previous_position: number;
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
   * Количество ходов для освобождения.
   * @type {number}
   */
  current_jail: number; 
   /**
   * Количество карточек "Выход из тюрьмы".
   * @type {number}
   */
  getOutOfJailCards: number;  
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
   * список ячеек синдиката.
   * @type { string }
   */
  syndicate: string[];  
  /**
   * ID игровой доски.
   * @type { IGameBoard }
   */
  board_id: IGameBoard;  
}



