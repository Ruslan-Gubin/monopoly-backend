import { Schema, model } from 'mongoose';
const CellSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rent: {
        type: Number,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
        default: 'white',
    },
});
export const CelldModel = model('Cell', CellSchema);
