import { Request, Response, RequestParamHandler, RequestHandler } from "express";

declare module "express" {
  interface Request {
    userId?: string;
  }
}