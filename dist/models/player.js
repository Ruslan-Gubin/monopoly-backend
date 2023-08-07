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
    in_jail: {
        type: Boolean,
        required: true,
        default: false,
    },
    current_jail: {
        type: Number,
    },
    color: {
        type: String,
        default: 'white',
    },
    image: {
        type: String,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true,
    },
    board_id: {
        type: Schema.Types.ObjectId,
        ref: 'GameBoardModel',
    },
}, { timestamps: true });
export const PlayerModel = model('Player', PlayerSchema);
