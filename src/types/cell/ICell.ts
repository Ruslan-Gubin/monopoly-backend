import { ICloudinaryImage, Document } from '../index.js';

/**
 * Интерфейс клетки.
 * @interface ICell
 * @extends {Document}
 */
export interface ICell extends Document {
  /**
   * Название игровой доски
   * @type {string}
   */
  board_name: string;
  /**
   * «Старт», «Свободная клетка», «Игровая карта»
   * @type {string}
   */
  type: string;
  /**
   * Наименование карточки
   * @type {string}
   */
  name: string;
  /**
   * Напровление карточки
   * @type {string}
   */
  direction: string;
  /**
   * Цена покупки клетки
   * @type {number}
   */
  price: number;
  /**
   * Стоимость аренды за попадание на эту клетку.
   * @type {[number]}
   */
  rent: number[];
  /**
   * Цвет клетки.
   * @type {string}
   */
  color: string;
  /**
   * Позиция на игровой доске.
   * @type {number}
   */
  position: number;
  /**
   * Изображение клетки.
   * @type {ICloudinaryImage}
   */
  image: ICloudinaryImage;
  /**
   * Стоимость покупки дома.
   * @type {number}
   */
  house_cost: number;
  /**
   * Стоимость покупки отеля.
   * @type {number}
   */
  hotel_cost: number;
  /**
   * Стоимость заложить недвижимость.
   * @type {number}
   */
  mortgage_value: number;
  /**
   * Позиция на доске (матрица).
   * @type {number}
   */
  position_matrix: {
    row_index: number;
    column_index: number;
  };
}
