export interface BoardCreateDTO {
  id: string;
  fullName: string;
  img: string;
  color: string;
}
export interface ConnectBoardDTO {
  fullName: string;
  id: string;
  method: string;
  boardId: string;
}
