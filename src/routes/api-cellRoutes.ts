import * as express from 'express';
import { cellController } from '../handlers/index.js';

const router: express.Router =  express.Router(); 

router.post("/api/create-cell",  cellController.createCell); 
router.get("/api/all-cells/:board_name",  cellController.getAllCell); 


export const cellRouter = router;