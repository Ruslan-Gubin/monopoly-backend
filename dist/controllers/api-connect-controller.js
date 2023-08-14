import { logger } from '../utils/index.js';
export class ConnectController {
    constructor(connectService) {
        this.connectService = connectService;
        this.connectServer = async (req, res) => {
            try {
                const connect = await this.connectService.connect();
                res.status(201).json(connect);
            }
            catch (error) {
                logger.error('Failed to get dice:', error);
                res.status(500).json({ error: 'Failed to get dice', errorMessage: error });
            }
        };
    }
}
