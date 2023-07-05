import { Schema, model } from 'mongoose';
const GameBoardSchema = new Schema({
    cells: {
        type: [Schema.Types.ObjectId],
        ref: 'CelldModel',
        default: [],
    },
    currentPlayerId: {
        type: String,
    },
    currentCellsId: {
        type: String,
    },
    action_cards: {
        type: [Schema.Types.ObjectId],
        ref: 'ActionCardModel',
        default: [],
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
    bank: {
        type: Schema.Types.ObjectId,
        ref: 'BankModel',
    },
    available_cells: {
        type: [String],
        require: true,
        default: [],
    },
    mortgaged_cells: {
        type: [String],
        require: true,
        default: [],
    }
}, { timestamps: true });
export const GameBoardModel = model('GameBoard', GameBoardSchema);
