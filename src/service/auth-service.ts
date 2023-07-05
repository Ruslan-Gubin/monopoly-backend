import { Model, UpdateWriteOpResult } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cloudinary } from '../config/cloudinary.js';
import * as types from '../types/index.js';
import { UserModel } from '../models/index.js';
import * as DTO from '../dtos/index.js';
import { CacheManager, logger } from '../utils/index.js';


export class AuthService {
  private  readonly model: Model<types.IUser>;
  private cache: CacheManager<types.IUser>;

  constructor( { cache }: { cache: CacheManager<types.IUser>} ) {
    this.model = UserModel
    this.cache = cache;
  }

  private getToken(id: string) {
    return jwt.sign({ _id: id }, process.env.SECRET_TOKEN as string, {
      expiresIn: '30d',
    });
  }

  async create(body: DTO.CreatedUserDTO): Promise<types.IUser | types.IReturnErrorObj> {
    try {
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

     if (!resImage) {
      throw new Error('Failed create user img')
     }
 
     const newUser = await new this.model({
       ...body,
       image: { public_id: resImage.public_id, url: resImage.secure_url },
       passwordHash: passwordBcrypt,
     }).save();
 
     const token = this.getToken(newUser._id);
 
     const { passwordHash, ...userData } = newUser._doc;

     this.cache.addKeyInCache(userData._id, (userData as types.IUser))

     return { ...userData, token }  as types.IUser; 
    } catch (error) {
      logger.error('Failed to create new user in service:', error);
      return { error, text: 'Failed to create new user in service' };
    }
  }

  async login(body: DTO.AuthorizationUserDTO): Promise<types.IUser | types.IReturnErrorObj> {
    try {
      if (!body.email) {
        throw new Error('Failed to email undefined');
      }
      const user = await this.model.findOne({ email: body.email });
  
      if (!user) {
        throw new Error('Failed to login or password');
      }
  
      const isValidPass = user._doc.passwordHash && bcrypt.compare(body.password, user._doc.passwordHash);
  
      if (!isValidPass) {
        throw new Error('Failed to login or password');
      }
  
      const token = this.getToken(user._id); 
  
      const { passwordHash, ...userData } = user._doc;
  
      return { ...userData, token }  as types.IUser;
    } catch (error) {
      logger.error('Failed to login user in service:', error);
      return { error, text: 'Failed to login user in service' };
    }
  }

  async getUser(userId: string): Promise<types.IUser | types.IReturnErrorObj > {
    try {
      if (!userId) {
        throw new Error('Failed to get user ID not found');
      }

      let getUserCache = this.cache.getValueInKey(userId)

      if (!getUserCache) {
        const user = await this.model.findById(userId);

        if (!user) {
          throw new Error('user undefined in db');
        }

        const { passwordHash, ...userData } = user._doc;

        getUserCache = (userData as types.IUser)

        this.cache.addKeyInCache(userId, (userData as types.IUser))
      }

      return getUserCache  as types.IUser;
    } catch (error) {
      logger.error('Failed to get user in service:', error);
      return { error, text: 'Failed to get user in service' };
    }
  }

  async setAuthOnline(online: boolean, id: string): Promise<UpdateWriteOpResult | types.IReturnErrorObj> {
    try {
      if (!id) {
        throw new Error('Failed to get user ID');
      }

      const userUpdate = await this.model.updateOne({ _id: id }, {  online  },{ returnDocument: 'after' });
      
      this.cache.addKeyInCache(id, (userUpdate as types.IUser | any))

      return userUpdate;
    } catch (error) {
      logger.error('Failed to change online state:', error);
      return { error, text: 'Failed to change online state' };
    }
  }

  async removeUser(id: string): Promise<{ success: boolean; message: string } | types.IReturnErrorObj> { 
    try {
      const idAuth = id;
      const auth = await this.model.findByIdAndDelete(idAuth);

      if (!auth) {
        throw new Error('Failed to get user id db');
      }
      
      this.cache.removeKeyFromCache(idAuth)

      const imageId = auth.image.public_id;
      await cloudinary.uploader.destroy(imageId);
  
      return { success: true, message: `${auth.fullName} user deleted` };
    } catch (error) {
      logger.error('Failed to remove user in service:', error);
      return { error, text: 'Failed to remove user in service' };
    }
  }

  async updateUser(body: DTO.UpdateUserDTO): Promise<types.IUser | types.IReturnErrorObj> {
    try {
      const idAuth = body.id;
      const prevImag = body.prevImag
      const fullName = body.fullName
      const changeUserImage = body.imag

      if (!idAuth || !fullName) {
        throw new Error('Failed to no idAuth or fullName')
      }

      if (changeUserImage) { 
      const updateUserImg = await  this.updateUserAndChangeImg({
          fullName,
          idAuth,
          prevImag,
          newAvatar: changeUserImage,
        })
        return updateUserImg;
      }
     
      const updateUser = await this.model.findByIdAndUpdate(
          idAuth, 
         {fullName},
         { returnDocument: 'after' }, 
       ); 
  
        if (!updateUser) {
          throw new Error('Failed to update user')
        }
        
       const { passwordHash, ...userData } = updateUser._doc;

       this.cache.addKeyInCache(idAuth, (userData as types.IUser))

      return userData  as types.IUser;
    } catch (error) {
      logger.error('Failed to update user in service:', error);
      return { error, text: 'Failed to update user in service' };
    }
  }

private updateUserAndChangeImg = async({prevImag, idAuth, fullName, newAvatar}: DTO.UserUpdateAndImgDTO) => {
  try {
    await cloudinary.uploader.destroy(prevImag); // remove prev avatar

    const result = await cloudinary.uploader.upload(newAvatar, {
        folder: 'Player',
        fetch_format: 'auto',   
      });
       
      const updateUser = await this.model.findByIdAndUpdate(
         idAuth, 
        {
          fullName,
          image: { public_id: result.public_id, url: result.secure_url },
        },
        { returnDocument: 'after' },
      ); 

      if (!updateUser) {
        throw new Error('Failed to update user')
      }

      const { passwordHash, ...userData } = updateUser._doc;
      this.cache.addKeyInCache(idAuth, (userData as types.IUser))
      return userData  as types.IUser;
  } catch (error) {
    logger.error('Failed to update user and user img:', error);
    return { error, text: 'Failed to update user and user img' };
  }
  }
  
}
