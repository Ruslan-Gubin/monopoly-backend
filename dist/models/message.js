import mongoose from "mongoose";
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const MessageModel = mongoose.model("Message", messageSchema);
