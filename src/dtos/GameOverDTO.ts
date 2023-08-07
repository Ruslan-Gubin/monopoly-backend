export interface GameOverPropsDTO {
  method: string;
  body: {
    ws_id: number;
    player_id: string;
    board_id: string;
    player_name: string;
  };
}
