import { Schema, model } from 'mongoose';
const PropertySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'PlayerModel',
        default: null,
    },
    price: {
        type: Number,
        required: true,
    },
    rent: {
        type: Number,
        required: true,
    }
}, { timestamps: true });
export const PropertyModel = model('Property', PropertySchema);
