import { Document } from '../Document/index.js';

export interface IActionCard extends Document {   //Карты действий
  content: string; // содержащая текстовое описание действия карты
  type: string; //  тип карты например, "Общественная казна" или "Шанс"
  description: string; // описание перемещение игрока, потеря денег, получение преимущества
  effect: string; // объект, описывающий эффекты, связанные с выполнением действия карточки
}