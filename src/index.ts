import express from "express";
import expressWs from 'express-ws';
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import * as routes from "./routes/index.js";
import { chalks } from "./utils/index.js";

const { app, getWss } = expressWs(express())

const aWss = getWss()
dotenv.config();
app.use(cors());
app.use(express.json({limit: '50mb'}));  

(async () => {
  if (process.env['MONGO_URL']) {
    await mongoose
    .connect(process.env['MONGO_URL'])
    .then(() => console.log(chalks.success("DB Product ok"))) 
    .catch((err) => console.log(chalks.error("DB error", err)));
  }
})();

app.use(routes.authRouter); 
app.use(routes.sessionRouter);

app.listen(process.env['PORT'] || 4444, () => {  
   console.log(chalks.success(`Listening port ${process.env['PORT'] || 4444}`)); 
});

export {app, aWss}
