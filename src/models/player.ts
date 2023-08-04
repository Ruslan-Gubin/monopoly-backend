import { Schema,  model } from 'mongoose';
import { IPlayer } from '../types/index.js';

const PlayerSchema: Schema<IPlayer> = new Schema({
  name: {
    type: String,
    required: true,
  },
  money: { 
    type: Number,
    required: true,
    default: 1500,
  },
  position: {
    type: Number,
    required: true,
    default: 0,
  },
  previous_position: {
    type: Number,
    required: true,
    default: 0,
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true,
  },
  properties: {
    type: [Schema.Types.ObjectId],
    ref: 'PropertyModel',
    default: [],
  },
  in_jail: {
    type: Boolean,
    required: true,
    default: false,
  },
  current_jail: {
    type: Number,
    default: 3,
  },
  getOutOfJailCards: {
    type: Number,
    required: true,
    default: 0,
  },
  color: {
    type: String,
    default: 'white',
  },
  image: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
    require: true,
  },
  syndicate: {
    type: [String],
    default: [],
  },
  board_id: {
    type: Schema.Types.ObjectId,
    ref: 'GameBoardModel',
  },
},
{ timestamps: true },
);

export const PlayerModel = model<IPlayer>('Player', PlayerSchema);