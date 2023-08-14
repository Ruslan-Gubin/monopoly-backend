import * as express from 'express';
import { ConnectController } from '../controllers/api-connect-controller.js';
import { ConnectService } from '../service/index.js';
const router = express.Router();
const connectService = new ConnectService();
const connectController = new ConnectController(connectService);
router.get("/api/connect", connectController.connectServer);
export const connectRouter = router;
