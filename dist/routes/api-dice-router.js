import * as express from 'express';
import { diceController } from '../handlers/index.js';
const router = express.Router();
router.get("/api/dice-board/:id", diceController.getDiceInBoard);
export const diceRouter = router;
