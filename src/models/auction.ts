import { Schema,  model } from 'mongoose';
import { IAuction } from '../types/index.js';

const AuctionSchema: Schema<IAuction> = new Schema({
  price: { 
    type: Number,
    default: 0,
  },
  players: {
    type: [String],
    default: [],
  },
  last_player_bet: {
    type: String,
    default: null,
  },
  cell_id: { 
    type: String,
  },
},
{ timestamps: true },
);

export const AuctionModel = model<IAuction>('Auction', AuctionSchema);