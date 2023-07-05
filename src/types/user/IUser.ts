import { Document } from '../Document/index.js'

export interface IUser extends Document {
  image: {public_id: string, url: string}
  _id: string
  fullName: string
  email: string
  online: boolean
  createdAt: string
  updatedAt: string
  passwordHash?: string
  token: string
  _doc: IUser
}


