import * as express from 'express';
import { CellController } from '../controllers/index.js';
import { CellService } from '../service/index.js';
import { nodeCache } from '../utils/index.js';

const router: express.Router =  express.Router(); 

export const cellService = new CellService({ cache: nodeCache }) 
const cellController = new CellController(cellService)

router.post("/api/create-cell",  cellController.createCell); 
router.get("/api/all-cells/:board_name",  cellController.getAllCell); 


export const cellRouter = router;