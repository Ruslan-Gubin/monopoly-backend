import mongoose from "mongoose";
import { IUser } from "../types/index.js";

const UserShema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true, //уникальное значение
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
  },
  { timestamps: true }// дата создания
);

export const UserModel = mongoose.model<IUser>("User", UserShema);
