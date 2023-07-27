import * as express from 'express';
import { authController } from '../handlers/index.js';
import { checkAuth, handleValidationErrors } from '../utils/index.js';
import { registerValedation, loginValedation } from "../validations/authValudation.js";

const router: express.Router =  express.Router();

router.post("/api/register", registerValedation, handleValidationErrors, authController.createUser); 
router.post("/api/login", loginValedation, handleValidationErrors, authController.authorizeUser);
router.get("/api/auth/:id", checkAuth, authController.getUserInfo);
 
router.delete('/api/auth-remove/:id', checkAuth, authController.removeUser);   

router.patch('/api/auth-update', checkAuth, handleValidationErrors, authController.updateUser);


export const authRouter = router;
 
 