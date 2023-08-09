export interface DiceUpdateDTO {
  dice_id: string;
  fields: {
    dice1: number;
    dice2: number;
    value: number;
    isDouble: boolean;
    current_id: string;
  } | string;
}
