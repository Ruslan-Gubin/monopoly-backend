import { Schema, model } from 'mongoose';
const DiceSchema = new Schema({
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
    },
    isDouble: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
export const DiceModel = model('Dice', DiceSchema);
