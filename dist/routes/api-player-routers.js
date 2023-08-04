import * as express from 'express';
import { playerController } from '../handlers/index.js';
const router = express.Router();
router.get("/api/players-board", playerController.getBoardPlayers);
export const playerRouter = router;
