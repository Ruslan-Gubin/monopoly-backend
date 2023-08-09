export interface IAuction {
  _id: string;
  /** Актуальная цена */
  price: number;
  /** Список участников */
  players: string[];
  /** Лидер */
  last_player_bet: string | null;
  /** ID ячейки */
  cell_id: string;
}
