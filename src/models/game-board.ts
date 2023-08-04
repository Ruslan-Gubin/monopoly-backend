import { Schema,  model } from 'mongoose';
import { IGameBoard } from '../types/index.js';

const GameBoardSchema: Schema<IGameBoard> = new Schema({
  board_name: {
    type: String,
    required: true,
    default: 'nep'
  },
  currentPlayerId: { //Текущая очередь игрока
    type: Schema.Types.ObjectId,
    ref: 'PlayerModel',
    required: true,
  },
  currentCellPosition: { //Текущая позиция  игрока todo Delete
    type: Number,
    default: 0,
  },
  currentCellId: { 
    type: String,
    default: null,
  },
  chanse_cards: { //todo Delete 
    type: [Schema.Types.ObjectId], 
    ref: 'ActionCardModel',
    default: [],
  },
  lottery_cards: {  //todo Delete
    type: [Schema.Types.ObjectId], 
    ref: 'ActionCardModel',
    default: [],
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
    type: [Schema.Types.ObjectId],
    ref: 'PlayerModel',
    default: [],
  },
  dice: {
    type: Schema.Types.ObjectId,
    ref: 'DiceModel',
  },
  free_propertyes: { //todo Delete
    type: [Schema.Types.ObjectId],
    ref: 'PropertyModel',
  },
  mortgaged_cells: { //todo Delete
    type: [Schema.Types.ObjectId],
    ref: 'PropertyModel',
    default: [],
  },
  occupied_properties: { //todo Delete
    type: [Schema.Types.ObjectId],
    ref: 'PropertyModel',
    default: [],
  },
  available_purchase: { // доступно для покупки
    type: Boolean,
    default: false,
  },
  need_rent: { 
    type: Number,
    default: 0,
  },
  choosing_action: { 
    type: Boolean,
    default: false,
  },
  start_move: { 
    type: Boolean,
    default: true,
  },
  property_current_player: { 
    type: Boolean,
    default: false,
  },
  action: { 
    type: String,
    default: 'trow dice',
  },
  price: { 
    type: Number,
    default: 0,
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