import * as express from 'express';
import { playerController } from './api-board-routes.js';
const router = express.Router();
router.get("/api/players-board/:id", playerController.getBoardPlayers);
export const playerRouter = router;
