import {  Document, IActionCard, IDice, IPlayer, IProperty, } from '../index.js';

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
   * @type { IPlayer }
   */
  currentPlayerId: IPlayer;
  /**
   * Позиция текущей клетки
   * @type { number }
   */
  currentCellPosition: number; // TODO delete
  /**
   * ID текущей клетки
   * @type { string }
   */
  currentCellId: string;
  /**
   * Mассив карт шанса
   * @type { [IActionCard] }
   */
  chanse_cards: IActionCard[];  // TODO delete
  /**
   * Mассив карт лотореи
   * @type { [IActionCard] }
   */
  lottery_cards: IActionCard[];  // TODO delete
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
   * @type { [IProperty] }
   */
  mortgaged_cells: IProperty[]  // TODO delete
  /**
   * Список id свободных собственностей
   * @type { [IProperty] }
   */
  free_propertyes: IProperty[]  // TODO delete
  /**
   * Список id занятых собственностей
   * @type { [IProperty] }
   */
  occupied_properties: IProperty[]  // TODO delete
  /**
   * Доступно для покупки
   * @type { boolean }
   */
  available_purchase: boolean  // TODO delete
  /**
   * Нужна аренда плата
   * @type { number }
   */
  need_rent: number;  // TODO delete
  /**
   * Стадия выбор действия
   * @type { boolean }
   */
  choosing_action: boolean;  // TODO delete
  /**
   * Стадия начала хода
   * @type { boolean }
   */
  start_move: boolean;  // TODO delete
  /**
   * Собственность текущего игрока
   * @type { boolean }
   */
  property_current_player: boolean;  // TODO delete
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
