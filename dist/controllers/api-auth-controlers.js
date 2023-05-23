import { authService } from '../service/authService.js';
import { handleError } from '../utils/index.js';
class AuthController {
    async createUser(req, res) {
        const body = req.body;
        await authService
            .create(body)
            .then((user) => res.status(201).json(user))
            .catch((error) => handleError(res, error, 'Не удалось создать пользователя'));
    }
    async authorization(req, res) {
        const body = req.body;
        await authService
            .login(body)
            .then((user) => res.status(200).json(user))
            .catch((error) => handleError(res, error, 'Не удалось авторизоватся!!'));
    }
    async getUserInfo(req, res) {
        const userId = req.params.id;
        await authService
            .getUser(userId)
            .then((user) => res.status(200).json(user))
            .catch((error) => handleError(res, error, 'Пользователь не найден'));
    }
    async getAllUsers(req, res) {
        const query = req.query;
        await authService
            .getAllUsers(query)
            .then((users) => res.status(200).json(users))
            .catch((error) => handleError(res, error, 'Пользователи не найдены'));
    }
    async getUserSinglPage(req, res) {
        const id = req.params.id;
        await authService
            .getUserSinglPage(id)
            .then((users) => res.status(200).json(users))
            .catch((error) => handleError(res, error, 'Пользователь не найден'));
    }
    async getUsersArray(req, res) {
        const query = req.query;
        await authService
            .getUsersArray(query)
            .then((users) => res.status(200).json(users))
            .catch((error) => handleError(res, error.message, 'Пользователи не найдены'));
    }
    async removeUser(req, res) {
        const id = req.params.id;
        await authService
            .remove(id)
            .then((data) => res.status(200).json({ ...data }))
            .catch((error) => handleError(res, error, 'Пользователя не удалось удалить'));
    }
    async getEmails(req, res) {
        await authService
            .getAllEmail()
            .then((data) => res.status(200).json(data))
            .catch((error) => handleError(res, error, `Не удалось найти все Email ${req}`));
    }
    async updateUser(req, res) {
        const body = req.body;
        await authService
            .update(body)
            .then((user) => res.status(200).json(user))
            .catch((error) => handleError(res, error, 'Пользователя не удалось изменить'));
    }
    async setAuthOnline(online, id) {
        await authService
            .setAuthOnline(online, id);
    }
}
export const authController = new AuthController();
