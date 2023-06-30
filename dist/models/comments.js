import mongoose from "mongoose";
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
export const MessageModel = mongoose.model("Message", messageSchema);
