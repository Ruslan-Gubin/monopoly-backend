import { Schema, model } from 'mongoose';
const ActionCardSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    effect: {
        type: String,
        required: true,
    },
});
export const ActionCardModel = model('ActionCard', ActionCardSchema);
