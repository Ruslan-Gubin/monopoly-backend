export interface UpdateDiceDTO {
  method: string;
  body: {
    current_id: string;
    dice_id: string;
    board_id: string;
    user_name: string;
    in_jail: boolean;
    player_id: string;
  };
}
