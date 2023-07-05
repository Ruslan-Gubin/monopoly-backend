import { ICloudinaryImage, Document } from '../index.js';

/**
 * Интерфейс клетки.
 * @interface ICell
 * @extends {Document}
 */
export interface ICell extends Document {
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
   * Цена покупки клетки
   * @type {number}
   */
  price: number;
  /**
   * Стоимость аренды за попадание на эту клетку.
   * @type {number}
   */
  rent: number;
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
}
