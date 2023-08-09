export interface GameOverPropsDTO {
  method: string;
  body: {
    ws_id: number;
    player_id: string;
    board_id: string;
    player_name: string;
  };
}

export interface RemoveGameDTO {
    board_id: string;
    auction_id: string,
    dice_id: string,
    player_id: string,
}
