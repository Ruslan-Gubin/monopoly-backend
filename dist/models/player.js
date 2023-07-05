import { Schema, model } from 'mongoose';
const PlayerSchema = new Schema({
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
}, { timestamps: true });
export const PlayerModel = model('Player', PlayerSchema);
