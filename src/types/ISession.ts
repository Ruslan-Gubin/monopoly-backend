import {  Document } from './index.js';

export interface SessionPlayer {
  id: string;
  fullName: string;
  img: string;
}

export interface ISession extends Document {
  owner: string;
  players: SessionPlayer[];
  _doc: ISession;
  isConfirm: boolean;
}
