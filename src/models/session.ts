import mongoose from "mongoose";
import { ISession } from "../types/sessionTypes/index.js";

const SessionShema = new mongoose.Schema<ISession>(
  {
    owner: {
      type: String,
      require: true,
    },
    players: {
      type: [{
        id:{type: String, required: true}, 
        fullName:{type: String, required: true}, 
        img:{type: String, required: true}
      }],
      
      default: [],
    }
  },
  { timestamps: true }// дата создания
);

export const sessionModel = mongoose.model<ISession>("Session", SessionShema);