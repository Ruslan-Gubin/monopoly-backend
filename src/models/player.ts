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
  getOutOfJailCards: {
    type: Number,
    required: true,
    default: 0,
  },
  board_id: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'white',
  },
},
{ timestamps: true },
);

export const PlayerModel = model<IPlayer>('Player', PlayerSchema);