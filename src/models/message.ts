import mongoose from "mongoose";
import { IMessage } from "../types/index.js";

const Schema = mongoose.Schema;

const messageSchema = new Schema<IMessage>({
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
    type : String,
    required: true,
  },
},
{ timestamps: true },
);

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);  