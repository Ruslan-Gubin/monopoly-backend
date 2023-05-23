import * as express from 'express';
import { authController } from '../controllers/index.js';
import { checkAuth, handleValidationErrors } from '../utils/index.js';
import { registerValedation, loginValedation } from "../validations/authValudation.js";

const router: express.Router =  express.Router();

router.post("/api/register", registerValedation, handleValidationErrors, authController.createUser); 
router.post("/api/login", loginValedation, handleValidationErrors, authController.authorization);
router.get("/api/auth/:id", checkAuth, authController.getUserInfo);
router.delete('/api/auth-remove/:id', checkAuth, authController.removeUser);

// router.get("/api/auth-all", checkAuth, authController.getAllUsers);      
// router.get("/api/auth/:id",  authController.getUserSinglPage);   


router.patch('/api/auth-update', checkAuth,handleValidationErrors, authController.updateUser);
// router.get('/api/auths-email', authController.getEmails)
// router.patch('/api/auth-online', checkAuth, authController.setAuthOnline)
// router.get('/api/auth-users-array',  authController.getUsersArray)

export const authRouter = router;
 
 