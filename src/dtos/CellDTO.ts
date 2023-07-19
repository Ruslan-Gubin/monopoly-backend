export interface CellCreateDTO {
  board_name: string;
  type: string;
  name: string;
  direction: string;
  price: number;
  position: number;
  color: string;
  house_cost: number;
  hotel_cost: number;
  mortgage_value: number;
  position_matrix_row: number;
  position_matrix_column: number;
  rent: number[];
}

export interface GetAllCellDTO {
  board_name: string;
}
