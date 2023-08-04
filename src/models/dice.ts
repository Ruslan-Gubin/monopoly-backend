import { Schema,  model } from 'mongoose';
import { IDice } from '../types/index.js';

const DiceSchema: Schema<IDice> = new Schema({
  current_id: {
    type: String,
  },
  dice1: {
    type: Number,
  },
  dice2: {
    type: Number,
  },
  value: {
    type: Number,
  },
  prev_value: {
    type: Number,
  },
  prev_player: {
    type: String,
    default: null,
  },
  isDouble: {
    type: Boolean,
    default: false,
  }, 
},
{ timestamps: true },
);

export const DiceModel = model<IDice>('Dice', DiceSchema);