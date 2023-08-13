import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cloudinary } from '../config/cloudinary.js';
import { UserModel } from '../models/index.js';
import { logger } from '../utils/index.js';
import { messageService } from '../handlers/session-handlers.js';
export class AuthService {
    constructor({ cache }) {
        this.updateUserAndChangeImg = async ({ prevImag, idAuth, fullName, newAvatar }) => {
            try {
                await cloudinary.uploader.destroy(prevImag);
                const result = await cloudinary.uploader.upload(newAvatar, {
                    folder: 'Player',
                    fetch_format: 'auto',
                });
                const updateUser = await this.model.findByIdAndUpdate(idAuth, {
                    fullName,
                    image: { public_id: result.public_id, url: result.secure_url },
                }, { returnDocument: 'after' });
                if (!updateUser) {
                    throw new Error('Failed to update user');
                }
                const { passwordHash, ...userData } = updateUser._doc;
                this.cache.addKeyInCache(idAuth, userData);
                return userData;
            }
            catch (error) {
                logger.error('Failed to update user and user img:', error);
                return 'Failed to update user and user img';
            }
        };
        this.model = UserModel;
        this.cache = cache;
    }
    getToken(id) {
        return jwt.sign({ _id: id }, process.env.SECRET_TOKEN, {
            expiresIn: '30d',
        });
    }
    async create(body) {
        try {
            if (!body) {
                throw new Error('Не получены данные нового пользователя');
            }
            const { imag } = body;
            const pas = body.password;
            const salt = await bcrypt.genSalt(10);
            const passwordBcrypt = await bcrypt.hash(pas, salt);
            const newUser = await new this.model({
                ...body,
                passwordHash: passwordBcrypt,
            }).save();
            if (!newUser) {
                throw new Error('Failed to create new user');
            }
            const resImage = await cloudinary.uploader.upload(imag, {
                folder: 'Player',
            });
            if (!resImage) {
                throw new Error('Failed create user img');
            }
            const updateImageUser = await this.model.findByIdAndUpdate(newUser._id, {
                image: { public_id: resImage.public_id, url: resImage.secure_url },
            }, { returnDocument: 'after' });
            if (!updateImageUser)
                throw new Error('Failed to update image in create new user');
            const token = this.getToken(updateImageUser._id);
            const { passwordHash, ...userData } = updateImageUser._doc;
            this.cache.addKeyInCache(userData._id.toString(), userData);
            return { ...userData, token };
        }
        catch (error) {
            logger.error('Failed to create new user in service:', error);
            return { error, text: 'Failed to create new user in service' };
        }
    }
    async login(body) {
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
            return { ...userData, token };
        }
        catch (error) {
            logger.error('Failed to login user in service:', error);
            return { error, text: 'Failed to login user in service' };
        }
    }
    async getUser(userId) {
        try {
            if (!userId) {
                throw new Error('Failed to get user ID not found');
            }
            let getUserCache = this.cache.getValueInKey(userId);
            if (!getUserCache) {
                const user = await this.model.findById(userId);
                if (!user) {
                    throw new Error('user undefined in db');
                }
                const { passwordHash, ...userData } = user._doc;
                getUserCache = userData;
                this.cache.addKeyInCache(userId, userData);
            }
            return getUserCache;
        }
        catch (error) {
            logger.error('Failed to get user in service:', error);
            return { error, text: 'Failed to get user in service' };
        }
    }
    async setAuthOnline(online, id) {
        try {
            if (!id) {
                throw new Error('Failed to get user ID');
            }
            const userUpdate = await this.model.updateOne({ _id: id }, { online }, { returnDocument: 'after' });
            this.cache.addKeyInCache(id, userUpdate);
            return userUpdate;
        }
        catch (error) {
            logger.error('Failed to change online state:', error);
            return { error, text: 'Failed to change online state' };
        }
    }
    async removeUser(id) {
        try {
            const idAuth = id;
            const auth = await this.model.findByIdAndDelete(idAuth);
            if (!auth) {
                throw new Error('Failed to get user id db');
            }
            this.cache.removeKeyFromCache(idAuth);
            const imageId = auth.image.public_id;
            await cloudinary.uploader.destroy(imageId);
            return { success: true, message: `${auth.fullName} user deleted` };
        }
        catch (error) {
            logger.error('Failed to remove user in service:', error);
            return { error, text: 'Failed to remove user in service' };
        }
    }
    async updateUser(body) {
        try {
            const { fullName, id, imag, prevImag } = body;
            if (!id || !fullName) {
                throw new Error('Failed to body data in update user service');
            }
            if (imag) {
                const updateUserImg = await this.updateUserAndChangeImg({
                    fullName,
                    idAuth: id,
                    prevImag,
                    newAvatar: imag,
                });
                if (typeof updateUserImg === 'string')
                    throw new Error('Failed update user image');
                await messageService.updateAllUserMessages(updateUserImg._id, updateUserImg.fullName, updateUserImg.image.url);
                return updateUserImg;
            }
            const updateUser = await this.model.findByIdAndUpdate(id, { fullName }, { returnDocument: 'after' });
            if (!updateUser)
                throw new Error('Failed to update user');
            await messageService.updateAllUserMessages(updateUser._id, updateUser.fullName, updateUser.image.url);
            const { passwordHash, ...userData } = updateUser._doc;
            this.cache.addKeyInCache(id, userData);
            return userData;
        }
        catch (error) {
            logger.error('Failed to update user in service:', error);
            return { error, text: 'Failed to update user in service' };
        }
    }
}
