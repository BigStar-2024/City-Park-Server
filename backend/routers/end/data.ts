
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
            list = await dataModel.find().sort({ time: -1 });
        } else {
            const lots = await lotModel.find({ owners: req.decodedToken?.email });
            console.log( "lots => ", lots)
            list = await dataModel.find({ lot: { $in: lots.map(lot => lot.siteCode) } }).sort({ time: -1 });
        }
        res.status(200).json(list);
    })
dataRouter
    .route("/site-code/:siteCode")
    .get(async (req, res) => {
        const { siteCode } = req.params
        const list = await dataModel.find({ lot: siteCode }).sort({ time: -1 });
        res.status(200).json(list);
    })

export default dataRouter;