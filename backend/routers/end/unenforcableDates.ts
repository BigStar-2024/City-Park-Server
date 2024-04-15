
import express from "express";
import { CustomUserRequest, FilesObject, JWT_SIGN_KEY } from "../../types";
import unenforcableDatesModel from "../../models/unenforcableDates";
import lotModel from "../../models/lot";

const unenforcableDatesRouter = express.Router();

unenforcableDatesRouter
    .route("/")
    .post(async (req, res) => {
        const { siteCode, dates } = req.body;
        try {
            const unenforcableDates = await unenforcableDatesModel.find({ siteCode });
            let data
            if (unenforcableDates.length === 0) {
                data = await unenforcableDatesModel.create({
                    siteCode, dates
                })
            } else {
                data = await unenforcableDatesModel.updateOne({ siteCode }, {
                    siteCode, dates
                })
            }

            res.status(200).json({
                success: true,
                data: data,
            });
        } catch (error) {
            console.log("API error", error);
            if (!res.headersSent) {
                res.send(500).json({
                    success: false,
                    error: "Server error",
                });
            }
        }

    })

unenforcableDatesRouter
    .route("/site-code/:siteCode/")
    .get(async (req, res) => {
        const { siteCode } = req.params
        const list = await unenforcableDatesModel.find({ siteCode });
        res.status(200).json(list[0]);
    })

export default unenforcableDatesRouter;