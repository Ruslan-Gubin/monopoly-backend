import { Schema, model } from 'mongoose';
const CellSchema = new Schema({
    board_name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    direction: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    rent: {
        type: [Number],
    },
    position: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
    },
    house_cost: {
        type: Number,
    },
    hotel_cost: {
        type: Number,
    },
    mortgage_value: {
        type: Number,
    },
    position_matrix: {
        row_index: {
            type: Number,
            require: true,
        },
        column_index: {
            type: Number,
            require: true,
        },
    },
});
export const CellModel = model('Cell', CellSchema);
