import { Schema,  model } from 'mongoose';
import { IGameBoard } from '../types/index.js';

const GameBoardSchema: Schema<IGameBoard> = new Schema({
  board_name: {
    type: String,
    required: true,
    default: 'nep'
  },
  currentPlayerId: { 
    type: Schema.Types.ObjectId,
    ref: 'PlayerModel',
    required: true,
  },
  chanse_current: {  
    type: Number, 
    default: 0,
  },
  lottery_current: {  
    type: Number, 
    default: 0,
  },
  players: {
    type: [String],
    required: true,
  },
  dice: {
    type: Schema.Types.ObjectId,
    ref: 'DiceModel',
  },
  action: { 
    type: String,
    default: 'start move',
  },
  price: { 
    type: Number,
    default: 0,
  },
  auction_id: { 
    type: String,
    required: true,
  },
  ws_id: { 
    type: Number,
  },
},
{ 
  timestamps: true,
},
);

export const GameBoardModel = model<IGameBoard>('GameBoard', GameBoardSchema);