import express from "express";
import { authReadOnlyMiddleware, authSuperMiddleware } from "../../middleware/auth";
import superUserRouter from "./user";
import lotRouter from "./lot";
import dataRouter from "./data";
import unenforcableDatesRouter from "./unenforcableDates";
const endUserRouter = express.Router();
endUserRouter.use('/user', authSuperMiddleware, superUserRouter)
endUserRouter.use('/lot', authReadOnlyMiddleware, lotRouter)
endUserRouter.use('/unenforcable-dates', authReadOnlyMiddleware, unenforcableDatesRouter)
endUserRouter.use('/data', dataRouter);
export default endUserRouter