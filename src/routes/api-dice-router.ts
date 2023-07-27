import * as express from 'express';
import { diceController } from './api-board-routes.js';

const router: express.Router =  express.Router(); 

router.get("/api/dice-board/:id",  diceController.getDiceInBoard); 


export const diceRouter = router;