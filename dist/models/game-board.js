import { Schema, model } from 'mongoose';
const GameBoardSchema = new Schema({
    board_name: {
        type: String,
        required: true,
        default: 'nep'
    },
    currentPlayerId: {
        type: Schema.Types.ObjectId,
        ref: 'PlayerModel',
        required: true,
    },
    currentCellPosition: {
        type: Number,
        default: 0,
    },
    currentCellId: {
        type: String,
        default: null,
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
        ref: 'PropertyModel',
    },
    mortgaged_cells: {
        type: [Schema.Types.ObjectId],
        ref: 'PropertyModel',
        default: [],
    },
    occupied_properties: {
        type: [Schema.Types.ObjectId],
        ref: 'PropertyModel',
        default: [],
    },
    available_purchase: {
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
}, {
    timestamps: true,
});
export const GameBoardModel = model('GameBoard', GameBoardSchema);
