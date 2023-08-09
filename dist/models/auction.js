import { Schema, model } from 'mongoose';
const AuctionSchema = new Schema({
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
}, { timestamps: true });
export const AuctionModel = model('Auction', AuctionSchema);
