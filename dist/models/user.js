import mongoose from "mongoose";
const UserShema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        require: true,
    },
    online: {
        type: Boolean,
        default: false,
    },
    image: {
        public_id: {
            type: String,
            require: true,
        },
        url: {
            type: String,
            require: true,
        }
    },
}, { timestamps: true });
export const UserModel = mongoose.model("User", UserShema);
