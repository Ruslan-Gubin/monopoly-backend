import {  Document,  IDice, IPlayer, IProperty, } from '../index.js';

/**
 * Интерфейс Игровой доски.
 * @interface IGameBoard
 * @extends {Document}
 */
export interface IGameBoard extends Document {
  /**
   * Название игровой доски
   * @type { string }
   */
  board_name: string;
  /**
   * Mассив участников игры
   * @type { [IPlayer] }
   */
  players: string[];
  /**
   * Идентификатор текущего активного игрока
   * @type { IPlayer }
   */
  currentPlayerId: IPlayer;
  /**
   * Текуший номер шанса
   * @type { number }
   */
  chanse_current: number;
  /**
   * Текуший номер лотореи
   * @type { number }
   */
  lottery_current: number;
  /**
   * Представляющий состояние игровых костей
   * @type { IDice }
   */
  dice: IDice;
  /**
   * Текущее доступное действие игрока
   * @type { string }
   */
  action: string;
  /**
   * Текущее оплата
   * @type { number }
   */
  price: number;
  /**
   * Текущий ID аукциона
   * @type { string }
   */
  auction_id: string;
  /**
   * ID для вебсокета
   * @type { number }
   */
  ws_id: number;
   /**
   * Doc доски
   * @type { IGameBoard }
   */
  _doc: IGameBoard
}
