export interface FinishMoveBodyDTO {
  player_id: string;
  cell_type: string;
  cell_name: string;
  cell_id: string;
  cell_price: number;
  cell_rent: number[];
  board_id: string;
  previous_position: number;
  isDouble: boolean;
  newPosition: number;
  property_id: string | null;
  ws_id: number;
}

export interface BoardFinishedMoveDTO {
  method: string;
  body: FinishMoveBodyDTO;
}

export interface MoveFinishPropertyDTO {
  cell_rent: number[];
  cell_price: number;
  board_id: string;
  cell_id: string;
  isDouble: boolean;
  player_id: string;
  property_id: string | null;
  players: string[];
}
