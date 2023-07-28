import * as express from 'express';
import { playerController } from '../handlers/index.js';


const router: express.Router =  express.Router(); 
router.get("/api/players-board/:id",  playerController.getBoardPlayers); 
export const playerRouter = router;