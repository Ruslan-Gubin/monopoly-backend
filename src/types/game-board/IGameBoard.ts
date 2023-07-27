import {  Document, ICell, IActionCard, IDice, IPlayer, } from '../index.js';

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
  players: IPlayer[];
  /**
   * Идентификатор текущего активного игрока
   * @type { string }
   */
  currentPlayerId: string;
  /**
   * Позиция текущей клетки
   * @type { string }
   */
  currentCellPosition: number;
  /**
   * Mассив карт шанса
   * @type { [IActionCard] }
   */
  chanse_cards: IActionCard[];
  /**
   * Mассив карт лотореи
   * @type { [IActionCard] }
   */
  lottery_cards: IActionCard[];
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
   * Список id заложенных клеток
   * @type { [string] }
   */
  mortgaged_cells: string[]
  /**
   * Список id свободных собственностей
   * @type { [CellModel] }
   */
  free_propertyes: ICell[]
  /**
   * Список id свободных собственностей
   * @type { [strign] }
   */
  occupied_properties: string[]
   /**
   * Doc доски
   * @type { IGameBoard }
   */
  _doc: IGameBoard
}
