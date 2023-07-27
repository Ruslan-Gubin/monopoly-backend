import { Schema, model } from 'mongoose';
const GameBoardSchema = new Schema({
    board_name: {
        type: String,
        required: true,
        default: 'nep'
    },
    currentPlayerId: {
        type: String,
        required: true,
    },
    currentCellPosition: {
        type: Number,
        default: 0,
    },
    chanse_cards: {
        type: [Schema.Types.ObjectId],
        ref: 'ActionCardModel',
        default: [],
    },
    lottery_cards: {
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
    free_propertyes: {
        type: [Schema.Types.ObjectId],
        ref: 'CellModel',
    },
    mortgaged_cells: {
        type: [String],
        require: true,
        default: [],
    },
    occupied_properties: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
export const GameBoardModel = model('GameBoard', GameBoardSchema);
