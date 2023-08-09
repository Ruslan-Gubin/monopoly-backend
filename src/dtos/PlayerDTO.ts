export interface PlayerPositionTheatreDTO {
  player_id: string;
  previous_position: number;
}
export interface PlayerUpdatePositionDTO extends PlayerPositionTheatreDTO {
  newPosition: number;
}

