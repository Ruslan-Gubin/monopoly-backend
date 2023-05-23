import mongoose from "mongoose";
const SessionShema = new mongoose.Schema({
    owner: {
        type: String,
        require: true,
    },
    players: {
        type: [{
                id: { type: String, required: true },
                fullName: { type: String, required: true },
                img: { type: String, required: true }
            }],
        default: [],
    }
}, { timestamps: true });
export const sessionModel = mongoose.model("Session", SessionShema);
