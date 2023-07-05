import mongoose from 'mongoose';
import { ISession } from '../types/index.js';

const SessionShema = new mongoose.Schema<ISession>(
  {
    owner: {
      type: String,
      require: true,
    },
    players: {
      type: [
        {
          id: { type: String, required: true },
          fullName: { type: String, required: true },
          img: { type: String, required: true },
        },
      ],

      default: [],
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const SessionModel = mongoose.model<ISession>('Session', SessionShema);
