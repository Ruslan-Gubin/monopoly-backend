import { Model, UpdateWriteOpResult } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userModel } from '../models/index.js';
import { cloudinary } from '../utils/cloudinary.js';
import * as types from '../types/userType/index.js';

class AuthService {
  constructor(private readonly model: Model<types.IUser>) {}

  private getToken(id: string) {
    return jwt.sign({ _id: id }, process.env.SECRET_TOKEN as string, {
      expiresIn: '30d',
    });
  }

  async create(body: types.CreatedUserBody): Promise<types.IUser> {
     if (!body) {
      throw new Error('Не получены данные нового пользователя');
    }

    const pas = body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordBcrypt = await bcrypt.hash(pas, salt);

    const image = body.imag;
    const resImage = await cloudinary.uploader.upload(image, {
      folder: 'Player',
    });

    const newUser = await new this.model({
      ...body,
      image: { public_id: resImage.public_id, url: resImage.secure_url },
      passwordHash: passwordBcrypt,
    }).save();

    const token = this.getToken(newUser._id);

    const { passwordHash, ...userData } = newUser._doc;
    
    return { ...userData, token };
  }

  async login(body: types.AuthorizationUserBody): Promise<types.IUser> {
    if (!body.email) {
      throw new Error('Не найден E-Mail пользователя');
    }
    const user = await this.model.findOne({ email: body.email });

    if (!user) {
      throw new Error('Неверный логин или пароль');
    }

    const isValidPass = user._doc.passwordHash && bcrypt.compare(body.password, user._doc.passwordHash);

    if (!isValidPass) {
      throw new Error('Неверный логин или пароль');
    }

    const token = this.getToken(user._id); 

    const { passwordHash, ...userData } = user._doc;

    return { ...userData, token };
  }

  async getUser(userId: string): Promise<types.IUser> {
    if (!userId) {
      throw new Error('ID не найден в запросе');
    }

    const user = await this.model.findById(userId);

    if (user) {
      const { passwordHash, ...userData } = user._doc;

      return userData;
    } else {
      throw new Error('no found user');
    }
  }

  async getUserSinglPage(id: string): Promise<types.IUser> {
    if (!id) {
      throw new Error('ID не найден в запросе');
    }

    const user = await this.model.findById(id);

    if (user) {
      const { passwordHash, ...userData } = user._doc;
      return userData;
    } else {
      throw new Error('Пользователь не найден');
    }
  }

  async getAllUsers(query: { userFullName: string }): Promise<types.IUser[]> {
    const searchFullname = query.userFullName;

    if (searchFullname.length === 0) {
      return [];
    }

    const users = await this.model
      .find({ fullName: { $regex: `${searchFullname}`, $options: 'i' } })
      .sort({ createdAt: -1 });

    return users;
  }

  async setAuthOnline(online: boolean, id: string): Promise<any> {
    if (!id) {
      throw new Error('Не удалось получить Id пользователя');
    }

    await this.model.updateOne({ _id: id }, {  online  });
  }

  async getUsersArray(query: types.GetUsersArrayQuery): Promise<types.IUser[]> {
    if (!query) {
      throw new Error('запашиваемые пользователи не найдены');
    }
    const limit = query.limit;
    const usersId = query.arr; // req - string 'id,id,id'
    const userArrId = usersId.split(',');
    const users = await this.model.find({ _id: { $in: userArrId } }, { passwordHash: false }).limit(limit);
    return users;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> { 
    const idAuth = id;
    const auth = await this.model.findByIdAndDelete(idAuth);

    if (auth) {
      const imageId = auth.image.public_id;
      await cloudinary.uploader.destroy(imageId);

      return { success: true, message: `${auth.fullName} user deleted` };
    } else {
      throw new Error('Не удалось удалить пользователя и фото');
    }
  }

  async getAllEmail(): Promise<string[]> {
    const emails = await this.model.find({}, { email: true, _id: false });
    const result = emails.map((item) => item.email);
    return result;
  }

  async update(body: types.UpdateUserBody): Promise<types.IUser> {
   
    const idAuth = body.id;
    const prevImag = body.prevImag
    const fullName = body.fullName

    

    if (body.imag) { 
     
    await cloudinary.uploader.destroy(prevImag); // remove prev avatar

    const newAvatar = body.imag; 
     const result = await cloudinary.uploader.upload(newAvatar, {
        folder: 'Player',
        fetch_format: 'auto',   
      });
       
      const updateUser = await this.model.findByIdAndUpdate(
         idAuth , 
        { 
          fullName,
          image: { public_id: result.public_id, url: result.secure_url },
        },
        { returnDocument: 'after' },
      ); 

      if (!updateUser) {
        throw new Error('Пользователя не удалось изменить')
      }

      const { passwordHash, ...userData } = updateUser._doc;
 
       return userData;
    }  else {
     
      const updateUser = await this.model.findByIdAndUpdate(
         idAuth , 
       { 
         
        fullName,  
      },
       { returnDocument: 'after' }, 
     ); 

      if (!updateUser) {
        throw new Error('Пользователя не удалось изменить')
      }

     const { passwordHash, ...userData } = updateUser._doc;

      return userData;
    }
  }
  
}

export const authService = new AuthService(userModel);
