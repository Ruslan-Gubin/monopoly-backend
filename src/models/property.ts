import { Schema,  model } from 'mongoose';
import { IProperty } from '../types/index.js';

const PropertySchema: Schema<IProperty> = new Schema({
  cell_id: {
    type: Schema.Types.ObjectId,
    ref: 'CellModel',
  },
  board_id: {
    type: Schema.Types.ObjectId,
    ref: 'CellModel',
  },
  owner: {
    type: String,
  },
  current_rent: {
    type: Number,
    required: true,
  },
  mortgage_price: {
    type: Number,
    required: true,
  },
  buy_back: {
    type: Number,
    required: true,
  },
  house_count: {
    type: Number,
    default: 0,
  },
  is_sindicate: {
    type: Boolean,
    default: false,
  },
  is_mortgage: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Number,
  },
  port_count: {
    type: Number,
  },
  utiletes_count: {
    type: Number,
  },
},
{ timestamps: true },
);

export const PropertyModel = model<IProperty>('Property', PropertySchema);

