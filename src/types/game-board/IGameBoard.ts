import {  Document, IBank, ICell, IActionCard, IDice, IPlayer } from '../index.js';

/**
 * Интерфейс Игровой доски.
 * @interface IGameBoard
 * @extends {Document}
 */
export interface IGameBoard extends Document {
  /**
   * Mассив игровых клеток
   * @type { [ICell] }
   */
  cells: ICell[];
  /**
   * Mассив участников игры
   * @type { [IPlayer] }
   */
  players: IPlayer[];
  /**
   * Идентификатор текущего активного игрока
   * @type { string }
   */
  currentPlayerId: string;
  /**
   * Идентификатор текущая активная клетка
   * @type { string }
   */
  currentCellsId: string;
  /**
   * Mассив карт действий
   * @type { [IActionCard] }
   */
  action_cards: IActionCard[];
  /**
   * Представляющий состояние игровых костей
   * @type { IDice }
   */
  dice: IDice;
  /**
   * Количество доступных денег и другие ресурсы
   * @type { IBank }
   */
  bank: IBank;
  /**
   * Список id доступных клеток для покупки
   * @type { [string] }
   */
  available_cells: string[]
  /**
   * Список id заложенных клеток
   * @type { [string] }
   */
  mortgaged_cells: string[]
}
