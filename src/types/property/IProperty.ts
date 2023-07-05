import { Document } from '../Document/index.js';


export interface IProperty  extends Document {
  name: string;
  owner: string | null;
  price: number;
  rent: number;
}