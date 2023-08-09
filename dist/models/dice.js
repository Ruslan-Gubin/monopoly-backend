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
        default: null,
    },
    isDouble: {
        type: Boolean,
        default: false,
    },
    double_count: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
export const DiceModel = model('Dice', DiceSchema);
