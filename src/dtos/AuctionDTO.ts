import { ICell } from "../types/index.js";

export interface AuctionRefreshDTO {
  method: string;
  body: {
    ws_id: number;
    player_name: string;
    board_id: string;
    auction_id: string;
    cell_name: string;
    property_price: number;
    players: string[];
  };
}
export interface AuctionActionhDTO {
  method: string;
  body: {
    ws_id: number;
    player_name: string;
    price: number;
    board_id: string;
    player_id: string;
    auction_id: string;
    players: string[];
    action: boolean;
    last_player_bet: string | null;
    isDouble: boolean;
    playersQueue: string[];
    currentPlayerQueue: string;
    cell_name: string;
    cell: ICell,
  };
}
