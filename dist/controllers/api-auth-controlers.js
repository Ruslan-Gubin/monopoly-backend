import { logger } from '../utils/index.js';
export class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.handleMessage = async (ws, message) => {
            const method = message.method;
            try {
                switch (method) {
                    case 'connection':
                        const connectId = message.id;
                        await this.setAuthOnline(ws, connectId, true);
                        break;
                    case 'disconect':
                        const disconectId = message.body.id;
                        await this.setAuthOnline(ws, disconectId, false);
                        break;
                }
            }
            catch (error) {
                logger.error('Failed to handle WebSocket message:', error);
                ws.send(JSON.stringify({ error: 'Failed to AuthController' }));
            }
        };
        this.createUser = async (req, res) => {
            try {
                const body = req.body;
                const user = await this.authService.create(body);
                res.status(201).json(user);
            }
            catch (error) {
                logger.error('Failed to create user:', error);
                res.status(500).json({ error: 'Не удалось создать пользователя', errorMessage: error });
            }
        };
        this.authorizeUser = async (req, res) => {
            try {
                const body = req.body;
                const autorization = await this.authService.login(body);
                res.status(200).json(autorization);
            }
            catch (error) {
                logger.error('Failed to autorization user:', error);
                res.status(500).json({ error: 'Не удалось авторизоваться', errorMessage: error });
            }
        };
        this.getUserInfo = async (req, res) => {
            try {
                const userId = req.params.id;
                const userInfo = await this.authService.getUser(userId);
                if (userInfo) {
                    res.status(200).json(userInfo);
                }
                else {
                    logger.info('Failed to user is not fined:');
                    res.status(404).json({ error: 'Пользователь не найден' });
                }
            }
            catch (error) {
                logger.error('Failed to get one user:', error);
                res.status(500).json({ error: 'Внутренняя ошибка сервера', errorMessage: error });
            }
        };
        this.updateUser = async (req, res) => {
            try {
                const body = req.body;
                const updateUser = await this.authService.updateUser(body);
                res.status(200).json(updateUser);
            }
            catch (error) {
                logger.error('Failed to update user:', error);
                res.status(500).json({ error: 'Пользователя не удалось изменить', errorMessage: error });
            }
        };
        this.removeUser = async (req, res) => {
            try {
                const id = req.params.id;
                const removeUser = await this.authService.removeUser(id);
                if (removeUser) {
                    res.status(200).json(removeUser);
                }
                else {
                    logger.errrorDB('Failed to user is not undefined:');
                    res.status(404).json({ error: 'Пользователь не найден' });
                }
            }
            catch (error) {
                logger.error('Failed to remove user:', error);
                res.status(500).json({ error: 'Не удалось удалить пользователя', errorMessage: error });
            }
        };
        this.setAuthOnline = async (ws, id, status) => {
            try {
                await this.authService.setAuthOnline(status, id);
            }
            catch (error) {
                logger.error('Failed to user set online status:', error);
                ws.send(JSON.stringify({ error: 'Failed to setAuthOnline' }));
            }
        };
    }
}
