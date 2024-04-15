import express, { Request, Response } from "express";
import dataRouter from "./data";
import cameraRouter from "./camera";
const senderRouter = express.Router();
senderRouter
    .route('/check-status')
    .post(async (req: Request, res: Response) => {
        res.status(200).json({ message: "Okay" });
    });
senderRouter.use('/camera', cameraRouter)
senderRouter.use('/data', dataRouter);
export default senderRouter