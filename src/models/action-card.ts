import { Schema,  model } from 'mongoose';
import { IActionCard } from '../types/index.js';

const ActionCardSchema: Schema<IActionCard> = new Schema({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  effect: {
    type: String,
    required: true,
  }, 
},
);

export const ActionCardModel = model<IActionCard>('ActionCard', ActionCardSchema);