import express from "express";
import expressWs from 'express-ws';
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import * as routes from "./routes/index.js";
import { logger } from "./utils/index.js";
const { app, getWss } = expressWs(express());
const aWss = getWss();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
(async () => {
    if (process.env['MONGO_URL']) {
        try {
            await mongoose.connect(process.env['MONGO_URL']);
            logger.connectSuccess("DB Product ok");
        }
        catch (error) {
            logger.errrorDB(`DB error, ${error}`);
        }
    }
})();
app.use(routes.authRouter);
app.use(routes.sessionRouter);
app.use(routes.cellRouter);
app.listen(process.env['PORT'] || 4444, () => {
    logger.connectSuccess(`Listening port ${process.env['PORT'] || 4444}`);
});
export { app, aWss };
