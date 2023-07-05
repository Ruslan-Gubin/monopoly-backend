import { Schema, model } from 'mongoose';
const BankSchema = new Schema({
    money: {
        type: Number,
        required: true,
        default: 1000000,
    },
    properties: {
        type: [String],
        required: true,
    },
    actionCards: {
        type: [String],
        required: true,
    },
    houses: {
        type: Number,
        required: true,
        default: 30,
    },
    hotels: {
        type: Number,
        required: true,
        default: 30,
    },
    board_id: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const BankModel = model('Bank', BankSchema);
