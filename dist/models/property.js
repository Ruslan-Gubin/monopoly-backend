import { Schema, model } from 'mongoose';
const PropertySchema = new Schema({
    cell_id: {
        type: Schema.Types.ObjectId,
        ref: 'CellModel',
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'PlayerModel',
    },
    price: {
        type: Number,
        required: true,
    },
    current_rent: {
        type: Number,
        required: true,
    },
    mortgage_price: {
        type: Number,
        required: true,
    },
    buy_back: {
        type: Number,
        required: true,
    },
    house_count: {
        type: Number,
        required: true,
        default: 0,
    },
    rent: {
        type: [Number],
        required: true,
    },
    is_sindicate: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
export const PropertyModel = model('Property', PropertySchema);
