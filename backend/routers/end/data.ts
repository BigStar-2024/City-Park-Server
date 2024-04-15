
import express from "express";
import { CustomUserRequest } from "../../types";
import dataModel from "../../models/data";
import lotModel from "../../models/lot";
const dataRouter = express.Router();

dataRouter
    .route("/")
    .get(async (req: CustomUserRequest, res) => {
        let list = []
        if (req.decodedToken?.admin) {
            list = await dataModel.find();
        } else {
            const lots = await lotModel.find({ owner: req.decodedToken?.email });
            list = await dataModel.find({ lot: { $in: lots.map(lot => lot.siteCode) } });
        }
        res.status(200).json(list);
    })
dataRouter
    .route("/site-code/:siteCode")
    .get(async (req, res) => {
        const { siteCode } = req.params
        const list = await dataModel.find({ lot: siteCode });
        res.status(200).json(list);
    })

export default dataRouter;