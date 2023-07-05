import jwt from "jsonwebtoken";
import {Request, Response, NextFunction } from "express";


const checkAuth = (req: Request, res: Response<{}>, next: NextFunction): void => {

  const token: string = (req.headers.authentication?.toString() || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded: any = jwt.verify(token, "secret123");
      req.userId = decoded._id; 
      next();
    } catch (error: any) {
      console.log(error, "Нет доступа");
       res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
     res.status(402).json({
      message: "Нет доступа!",
    });
  }
};

export { checkAuth };
